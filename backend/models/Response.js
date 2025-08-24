const mongoose = require('mongoose');

const fieldResponseSchema = new mongoose.Schema({
  fieldId: { type: String, required: true },
  fieldLabel: { type: String, required: true },
  fieldType: { 
    type: String, 
    required: true,
    enum: ['singleLineText', 'multilineText', 'singleSelect', 'multipleSelect', 'attachment']
  },
  value: mongoose.Schema.Types.Mixed,
  files: [{
    originalName: String,
    filename: String,
    size: Number,
    mimetype: String,
    url: String
  }]
}, { _id: false });

const responseSchema = new mongoose.Schema({
  formId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Form', 
    required: true 
  },
  airtableBaseId: { type: String, required: true },
  airtableTableId: { type: String, required: true },
  airtableRecordId: String,
  responses: [fieldResponseSchema],
  submittedBy: {
    ip: String,
    userAgent: String,
    referrer: String,
    email: String,
    name: String
  },
  status: {
    type: String,
    enum: ['pending', 'submitted', 'failed', 'synced'],
    default: 'pending'
  },
  errors: [{
    timestamp: { type: Date, default: Date.now },
    message: String,
    details: mongoose.Schema.Types.Mixed
  }],
  syncStatus: {
    lastSyncAttempt: Date,
    syncAttempts: { type: Number, default: 0 },
    lastSyncError: String,
    isSynced: { type: Boolean, default: false }
  },
  metadata: {
    timeToComplete: Number,
    deviceType: String,
    browserInfo: String,
    completionPercentage: { type: Number, default: 100 }
  }
}, { timestamps: true });

responseSchema.index({ formId: 1, createdAt: -1 });
responseSchema.index({ status: 1 });
responseSchema.index({ airtableRecordId: 1 });
responseSchema.index({ 'submittedBy.email': 1 });
responseSchema.index({ 'syncStatus.isSynced': 1 });
responseSchema.index({ createdAt: -1 });

responseSchema.virtual('responseData').get(function() {
  const data = {};
  this.responses.forEach(response => {
    data[response.fieldId] = response.value;
  });
  return data;
});

responseSchema.methods.addError = function(message, details = null) {
  this.errors.push({
    message,
    details,
    timestamp: new Date()
  });
  this.status = 'failed';
  return this.save();
};

responseSchema.methods.markAsSynced = function(airtableRecordId) {
  this.airtableRecordId = airtableRecordId;
  this.status = 'synced';
  this.syncStatus.isSynced = true;
  this.syncStatus.lastSyncAttempt = new Date();
  return this.save();
};

responseSchema.methods.updateSyncAttempt = function(error = null) {
  this.syncStatus.syncAttempts += 1;
  this.syncStatus.lastSyncAttempt = new Date();

  if (error) {
    this.syncStatus.lastSyncError = error.message || error;
    this.status = 'failed';
  }

  return this.save();
};

responseSchema.statics.findPendingSync = function() {
  return this.find({
    'syncStatus.isSynced': false,
    'syncStatus.syncAttempts': { $lt: 3 },
    status: { $ne: 'synced' }
  });
};

responseSchema.statics.getFormAnalytics = function(formId, startDate, endDate) {
  const matchStage = { formId: new mongoose.Types.ObjectId(formId) };

  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalResponses: { $sum: 1 },
        successfulSubmissions: {
          $sum: { $cond: [{ $eq: ['$status', 'synced'] }, 1, 0] }
        },
        averageCompletionTime: { $avg: '$metadata.timeToComplete' },
        responsesByDay: {
          $push: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            status: '$status'
          }
        }
      }
    }
  ]);
};

responseSchema.pre('save', function(next) {
  if (!this.metadata.completionPercentage) {
    const totalFields = this.responses.length;
    const completedFields = this.responses.filter(r =>
      r.value && r.value !== '' && r.value !== null
    ).length;

    this.metadata.completionPercentage = totalFields > 0
      ? Math.round((completedFields / totalFields) * 100)
      : 0;
  }
  next();
});

const Response = mongoose.model('Response', responseSchema);

module.exports = Response;
