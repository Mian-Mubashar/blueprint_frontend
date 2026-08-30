import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building,
  CreditCard,
  Briefcase,
  DollarSign,
  Save,
  Edit,
  CheckCircle,
  Lock,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import UserLayout from '../components/UserLayout';

const Profile = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    
    // Banking Information
    bvn: '',
    bankAccountNumber: '',
    bankName: '',
    accountName: '',
    
    // Employment Information
    employmentStatus: '',
    monthlyIncome: '',
    employerName: '',
    jobTitle: '',
    employmentDuration: '',
    
    // Password Change
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users/profile');
      const userData = response.data.user;
      
      setFormData({
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        dateOfBirth: userData.date_of_birth ? userData.date_of_birth.split('T')[0] : '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        bvn: userData.bvn || '',
        bankAccountNumber: userData.bank_account_number || '',
        bankName: userData.bank_name || '',
        accountName: userData.account_name || '',
        employmentStatus: userData.employment_status || '',
        monthlyIncome: userData.monthly_income || '',
        employerName: userData.employer_name || '',
        jobTitle: userData.job_title || '',
        employmentDuration: userData.employment_duration || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Fetch profile error:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validate account number - only numbers, max 10 digits
    if (name === 'bankAccountNumber') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 10) {
        setFormData(prev => ({
          ...prev,
          [name]: digitsOnly
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const formatNigerianPhone = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as Nigerian phone number
    if (digits.startsWith('234')) {
      return '+' + digits;
    } else if (digits.startsWith('0')) {
      return '+234' + digits.substring(1);
    } else if (digits.length > 0) {
      return '+234' + digits;
    }
    return value;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatNigerianPhone(e.target.value);
    setFormData(prev => ({
      ...prev,
      phone: formatted
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        bvn: formData.bvn,
        bankAccountNumber: formData.bankAccountNumber,
        bankName: formData.bankName,
        accountName: formData.accountName,
        employmentStatus: formData.employmentStatus,
        monthlyIncome: formData.monthlyIncome,
        employerName: formData.employerName,
        jobTitle: formData.jobTitle,
        employmentDuration: formData.employmentDuration
      };

      const response = await axios.put('/api/auth/profile', updateData);
      
      toast.success('Profile updated successfully!');
      setEditing(false);
      fetchProfile(); // Refresh data
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setSaving(true);
      await axios.put('/api/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      toast.success('Password changed successfully!');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Change password error:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8" data-aos="fade-up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-2">
                Manage your personal information and account settings
              </p>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="btn-primary flex items-center justify-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6" data-aos="fade-up" data-aos-delay="100">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab('personal')}
              className={`flex-1 px-4 py-2.5 rounded-md font-medium transition-all ${
                activeTab === 'personal'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab('banking')}
              className={`flex-1 px-4 py-2.5 rounded-md font-medium transition-all ${
                activeTab === 'banking'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CreditCard className="w-4 h-4 inline mr-2" />
              Banking
            </button>
            <button
              onClick={() => setActiveTab('employment')}
              className={`flex-1 px-4 py-2.5 rounded-md font-medium transition-all ${
                activeTab === 'employment'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Briefcase className="w-4 h-4 inline mr-2" />
              Employment
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 px-4 py-2.5 rounded-md font-medium transition-all ${
                activeTab === 'security'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Shield className="w-4 h-4 inline mr-2" />
              Security
            </button>
          </div>
        </div>

        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <div className="card" data-aos="fade-up" data-aos-delay="200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2 text-primary-600" />
                Personal Information
              </h2>
              {authUser?.is_verified && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={`input-field pl-10 ${!editing ? 'bg-gray-50' : ''}`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={`input-field pl-10 ${!editing ? 'bg-gray-50' : ''}`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={`input-field pl-10 ${!editing ? 'bg-gray-50' : ''}`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-[45%] transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    disabled={!editing}
                    className={`input-field pl-10 ${!editing ? 'bg-gray-50' : ''}`}
                    placeholder="+234..."
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={`input-field pl-10 ${!editing ? 'bg-gray-50' : ''}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={`input-field pl-10 ${!editing ? 'bg-gray-50' : ''}`}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!editing}
                    rows={3}
                    className={`input-field pl-10 ${!editing ? 'bg-gray-50' : ''}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={`input-field pl-10 ${!editing ? 'bg-gray-50' : ''}`}
                  />
                </div>
              </div>
            </div>

            {editing && (
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => {
                    setEditing(false);
                    fetchProfile();
                  }}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex items-center"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Banking Information Tab */}
        {activeTab === 'banking' && (
          <div className="card" data-aos="fade-up" data-aos-delay="200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-primary-600" />
                Banking Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BVN
                </label>
                <input
                  type="text"
                  name="bvn"
                  value={formData.bvn}
                  onChange={handleInputChange}
                  disabled={!editing}
                  maxLength={11}
                  className={`input-field ${!editing ? 'bg-gray-50' : ''}`}
                  placeholder="11-digit BVN"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  name="bankAccountNumber"
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.bankAccountNumber}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className={`input-field ${!editing ? 'bg-gray-50' : ''}`}
                  placeholder="10-digit account number"
                />
                {editing && formData.bankAccountNumber && formData.bankAccountNumber.length < 10 && (
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.bankAccountNumber.length}/10 digits
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className={`input-field ${!editing ? 'bg-gray-50' : ''}`}
                  placeholder="e.g., Access Bank, GTBank"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className={`input-field ${!editing ? 'bg-gray-50' : ''}`}
                  placeholder="Account holder name"
                />
              </div>
            </div>

            {editing && (
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => {
                    setEditing(false);
                    fetchProfile();
                  }}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex items-center"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Employment Information Tab */}
        {activeTab === 'employment' && (
          <div className="card" data-aos="fade-up" data-aos-delay="200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-primary-600" />
                Employment Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Status
                </label>
                <select
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className={`input-field ${!editing ? 'bg-gray-50' : ''}`}
                >
                  <option value="">Select status</option>
                  <option value="employed">Employed</option>
                  <option value="self_employed">Self Employed</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="student">Student</option>
                  <option value="retired">Retired</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Income (₦)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={`input-field pl-10 ${!editing ? 'bg-gray-50' : ''}`}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employer Name
                </label>
                <input
                  type="text"
                  name="employerName"
                  value={formData.employerName}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className={`input-field ${!editing ? 'bg-gray-50' : ''}`}
                  placeholder="Company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className={`input-field ${!editing ? 'bg-gray-50' : ''}`}
                  placeholder="Your position"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Duration (months)
                </label>
                <input
                  type="number"
                  name="employmentDuration"
                  value={formData.employmentDuration}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className={`input-field ${!editing ? 'bg-gray-50' : ''}`}
                  placeholder="e.g., 24"
                />
              </div>
            </div>

            {editing && (
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => {
                    setEditing(false);
                    fetchProfile();
                  }}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex items-center"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="card" data-aos="fade-up" data-aos-delay="200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-primary-600" />
                Change Password
              </h2>
            </div>

            <div className="max-w-md space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="input-field pl-10 pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="input-field pl-10 pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="input-field pl-10 pr-10"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handlePasswordChange}
                disabled={saving || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                className="btn-primary w-full flex items-center justify-center"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default Profile;

