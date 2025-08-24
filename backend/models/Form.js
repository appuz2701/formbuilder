const mongoose = require('mongoose');

const conditionalRuleSchema = new mongoose.Schema({
  fieldId: { type: String, required: true },
  operator: { 
    type: String, 
    required: true,
    enum: ['equals', 'not_equals', 'contains', 'not_contains', 'is_empty', 'is_not_empty']
  },
  value: mongoose.Schema.Types.Mixed
}, { _id: false });

const formFieldSchema = new mongoose.Schema({
  airtableFieldId: { type: String, required: true },
  airtableFieldName: { type: String, required: true },
  airtableFieldType: { 
    type: String, 
    required: true,
    enum: ['singleLineText', 'multilineText', 'singleSelect', 'multipleSelect', 'attachment']
  },
  label: { type: String, required: true },
  placeholder: String,
  description: String,
  required: { type: Boolean, default: false },
  options: [{
    id: String,
    name: String,
    color: String
  }],
  showWhen: [conditionalRuleSchema],
  order: { type: Number, required: true },
  isVisible: { type: Boolean, default: true }
}, { _id: false });

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  airtableBaseId: { type: String, required: true },
  airtableBaseName: { type: String, required: true },
  airtableTableId: { type: String, required: true },
  airtableTableName: { type: String, required: true },
  fields: [formFieldSchema],
  settings: {
    allowMultipleSubmissions: { type: Boolean, default: true },
    requireLogin: { type: Boolean, default: false },
    showProgressBar: { type: Boolean, default: true },
    submitButtonText: { type: String, default: 'Submit' },
    successMessage: { type: String, default: 'Thank you for your submission!' },
    redirectUrl: String
  },
  isActive: { type: Boolean, default: true },
  isPublished: { type: Boolean, default: false },
  stats: {
    totalViews: { type: Number, default: 0 },
    totalSubmissions: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 }
  },
  shareSettings: {
    isPublic: { type: Boolean, default: true },
    shareUrl: String,
    embedCode: String
  }
}, { timestamps: true });

formSchema.index({ userId: 1, createdAt: -1 });
formSchema.index({ isActive: 1, isPublished: 1 });
formSchema.index({ 'shareSettings.shareUrl': 1 });
formSchema.index({ airtableBaseId: 1, airtableTableId: 1 });

formSchema.virtual('url').get(function() {
  return `/form/${this._id}`;
});

formSchema.pre('save', function(next) {
  if (this.isNew || !this.shareSettings.shareUrl) {
    this.shareSettings.shareUrl = this._id.toString();
    this.shareSettings.embedCode = `<iframe src="${process.env.CLIENT_URL}/embed/${this._id}" width="100%" height="600" frameborder="0"></iframe>`;
  }
  if (this.stats.totalViews > 0) {
    this.stats.conversionRate = Math.round((this.stats.totalSubmissions / this.stats.totalViews) * 100);
  }
  next();
});

formSchema.methods.incrementViews = function() {
  this.stats.totalViews += 1;
  return this.save();
};

formSchema.methods.incrementSubmissions = function() {
  this.stats.totalSubmissions += 1;
  return this.save();
};

formSchema.statics.findPublished = function() {
  return this.find({ isActive: true, isPublished: true });
};

formSchema.statics.findByUserWithStats = function(userId) {
  return this.find({ userId })
    .select('title description isActive isPublished stats createdAt updatedAt')
    .sort({ updatedAt: -1 });
};

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
