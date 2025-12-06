"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { BottomNav } from '@/components/navigation/BottomNav';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  membershipType: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  joinDate: string;
  workoutsCompleted: number;
  membershipStartDate?: string;
  membershipEndDate?: string;
  hasPremiumHubAccess?: boolean;
  premiumHubAccessEndDate?: string;
}

interface EditModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, updates: any) => Promise<void>;
}

function EditUserModal({ user, isOpen, onClose, onSave }: EditModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    membershipType: 'None',
    hasPremiumHubAccess: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        membershipType: user.membershipType || 'None',
        hasPremiumHubAccess: user.hasPremiumHubAccess || false,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      await onSave(user.id, formData);
      onClose();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg glass-panel p-6 max-h-[90vh] overflow-y-auto"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Edit User</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Membership Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Membership Type
              </label>
              <select
                value={formData.membershipType}
                onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="None">None</option>
                <option value="Basic">Basic (₹999/month)</option>
                <option value="Premium">Premium (₹1,999/month)</option>
                <option value="VIP">VIP (₹3,999/month)</option>
              </select>
            </div>

            {/* Premium Hub Access */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <input
                type="checkbox"
                id="premiumHub"
                checked={formData.hasPremiumHubAccess}
                onChange={(e) => setFormData({ ...formData, hasPremiumHubAccess: e.target.checked })}
                className="w-5 h-5 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="premiumHub" className="text-sm font-medium text-gray-300 cursor-pointer">
                Premium Hub Access (₹199/month)
                <span className="block text-xs text-gray-400 font-normal mt-0.5">
                  Unlocks Dashboard, Workouts, Nutrition & more
                </span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Inactive' | 'Suspended'>('All');
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.users) {
        const formattedUsers = data.users.map((user: any) => ({
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          membershipType: user.membershipType || 'None',
          status: user.isEmailVerified ? 'Active' : 'Inactive',
          joinDate: new Date(user.createdAt).toLocaleDateString(),
          workoutsCompleted: user.attendanceStreak || 0,
          membershipStartDate: user.membershipStartDate,
          membershipEndDate: user.membershipEndDate,
          hasPremiumHubAccess: user.hasPremiumHubAccess || false,
          premiumHubAccessEndDate: user.premiumHubAccessEndDate,
        }));
        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleToggleHubAccess = async (userId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const newStatus = !currentStatus;

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hasPremiumHubAccess: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state immediately
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === userId 
              ? {
                  ...u,
                  hasPremiumHubAccess: data.user.hasPremiumHubAccess || false,
                  premiumHubAccessEndDate: data.user.premiumHubAccessEndDate,
                }
              : u
          )
        );
        alert(`✅ Hub Access ${newStatus ? 'enabled' : 'disabled'} successfully!`);
      } else {
        alert('❌ Failed to update hub access');
      }
    } catch (error) {
      console.error('Toggle hub access error:', error);
      alert('❌ Failed to update hub access');
    }
  };

  const handleSaveUser = async (userId: string, updates: any) => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');

      console.log('Saving user updates:', updates);
      console.log('hasPremiumHubAccess value:', updates.hasPremiumHubAccess);

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      console.log('Server response:', data);
      console.log('Updated user from server:', data.user);

      if (data.success) {
        // Update local users array immediately with the returned data
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === userId 
              ? {
                  ...u,
                  name: data.user.name,
                  email: data.user.email,
                  phone: data.user.phone || '',
                  membershipType: data.user.membershipType || 'None',
                  hasPremiumHubAccess: data.user.hasPremiumHubAccess || false,
                  premiumHubAccessEndDate: data.user.premiumHubAccessEndDate,
                }
              : u
          )
        );
        alert('✅ User updated successfully!');
        setIsEditModalOpen(false);
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      alert(`❌ Failed to update user: ${error}`);
      throw error;
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`⚠️ Delete User: ${user.name}?\n\nThis will:\n- Remove user account\n- Delete workout history\n- Cancel membership\n- Remove all data\n\nThis action cannot be undone!\n\nProceed with deletion?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ ${user.name} deleted successfully!`);
        fetchUsers(); // Refresh the list
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      alert(`❌ Failed to delete user: ${error}`);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'Suspended': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getMembershipColor = (type: string) => {
    if (type === 'VIP') return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
    if (type === 'Premium') return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
    if (type === 'Basic') return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    return 'bg-gray-500/20 text-gray-400';
  };

  return (
    <section aria-label="Admin user management" className="space-y-5 lg:space-y-8 min-h-screen p-4 lg:p-8 pb-24" style={{ background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)' }}>
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-4xl font-bold text-white">User Management</h2>
          <p className="text-sm lg:text-base text-gray-300 mt-1">{filteredUsers.length} members</p>
        </div>
      </header>

      {/* Filters & Search */}
      <div className="glass-card p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto">
            {(['All', 'Active', 'Inactive', 'Suspended'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${filterStatus === status
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
        </div>
      )}

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {!loading && filteredUsers.map((user) => (
          <div key={user.id} className="glass-card p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                  {user.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{user.name}</h3>
                  <p className="text-xs text-gray-300">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Membership:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMembershipColor(user.membershipType)}`}>
                  {user.membershipType}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Hub Access:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.hasPremiumHubAccess
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                  }`}>
                  {user.hasPremiumHubAccess ? '✓ Active' : '✗ None'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Joined:</span>
                <span className="text-xs text-gray-200">{user.joinDate}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleToggleHubAccess(user.id, user.hasPremiumHubAccess || false)}
                className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  user.hasPremiumHubAccess
                    ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                    : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                }`}
                title={user.hasPremiumHubAccess ? 'Remove Hub Access' : 'Grant Hub Access'}
              >
                {user.hasPremiumHubAccess ? '✓ Hub' : '+ Hub'}
              </button>
              <button
                onClick={() => handleEditUser(user)}
                className="flex-1 px-3 py-2 rounded-xl bg-blue-500/20 text-blue-300 text-sm font-medium hover:bg-blue-500/30 transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteUser(user)}
                className="flex-1 px-3 py-2 rounded-xl bg-red-500/20 text-red-300 text-sm font-medium hover:bg-red-500/30 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block glass-card overflow-hidden">
        {!loading && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Membership</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Hub Access</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Join Date</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-all"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {user.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <span className="font-medium text-white">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-200 text-sm">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getMembershipColor(user.membershipType)}`}>
                          {user.membershipType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${user.hasPremiumHubAccess
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                          }`}>
                          {user.hasPremiumHubAccess ? '✓ Active' : '✗ None'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-200 text-sm">{user.joinDate}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleHubAccess(user.id, user.hasPremiumHubAccess || false)}
                            className={`p-2 rounded-lg hover:bg-white/10 transition-all ${
                              user.hasPremiumHubAccess ? 'text-green-400' : 'text-purple-400'
                            }`}
                            aria-label={user.hasPremiumHubAccess ? 'Remove Hub Access' : 'Grant Hub Access'}
                            title={user.hasPremiumHubAccess ? 'Remove Hub Access' : 'Grant Hub Access'}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              {user.hasPremiumHubAccess ? (
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              ) : (
                                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              )}
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-2 rounded-lg hover:bg-white/10 transition-all text-blue-400"
                            aria-label="Edit user"
                            title="Edit user"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="p-2 rounded-lg hover:bg-white/10 transition-all text-red-400"
                            aria-label="Delete user"
                            title="Delete user"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex items-center justify-between">
              <p className="text-sm text-gray-300">Showing {filteredUsers.length} of {users.length} users</p>
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      <EditUserModal
        user={editingUser}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </section>
  );
}
