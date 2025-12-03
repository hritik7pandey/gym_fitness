"use client";
import React, { useState, useEffect } from 'react';
import { motion } from '@/lib/motion';
import { BottomNav } from '@/components/navigation/BottomNav';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  membershipType: 'Basic' | 'Premium' | 'Elite';
  status: 'Active' | 'Inactive' | 'Suspended';
  joinDate: string;
  workoutsCompleted: number;
}

// Mock data - TODO: fetch from API
const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', membershipType: 'Premium', status: 'Active', joinDate: '2024-01-15', workoutsCompleted: 42 },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', membershipType: 'Elite', status: 'Active', joinDate: '2024-02-20', workoutsCompleted: 67 },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', membershipType: 'Basic', status: 'Active', joinDate: '2024-03-10', workoutsCompleted: 23 },
  { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', membershipType: 'Premium', status: 'Inactive', joinDate: '2023-12-05', workoutsCompleted: 89 },
  { id: '5', name: 'David Brown', email: 'david@example.com', membershipType: 'Basic', status: 'Active', joinDate: '2024-04-01', workoutsCompleted: 15 },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Inactive' | 'Suspended'>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
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
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          membershipType: user.membershipType || 'Basic',
          status: user.isEmailVerified ? 'Active' : 'Inactive',
          joinDate: new Date(user.createdAt).toLocaleDateString(),
          workoutsCompleted: user.attendanceStreak || 0,
        }));
        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
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
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Inactive': return 'bg-slate-100 text-slate-600';
      case 'Suspended': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100';
    }
  };

  const getMembershipColor = (type: string) => {
    switch (type) {
      case 'Elite': return 'bg-gradient-to-r from-iosPurple to-iosBlue text-white';
      case 'Premium': return 'bg-iosBlue/20 text-iosBlue';
      case 'Basic': return 'bg-slate-200 text-slate-700';
      default: return 'bg-slate-100';
    }
  };

  return (
    <section aria-label="Admin user management" className="space-y-5 lg:space-y-8">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-4xl font-bold">User Management</h2>
          <p className="text-sm lg:text-base text-slate-500 mt-1">{filteredUsers.length} members</p>
        </div>
        <button 
          onClick={async () => {
            const name = prompt('Enter user name:');
            if (!name) return;
            const email = prompt('Enter user email:');
            if (!email) return;
            const phone = prompt('Enter user phone (+91...):');
            if (!phone) return;
            
            const membershipType = prompt('Membership type? (Basic / Premium / Elite)') || 'Basic';
            
            try {
              const token = localStorage.getItem('authToken');
              const response = await fetch('/api/admin/users/create', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name,
                  email,
                  phone,
                  membershipType,
                  membershipDuration: 30,
                }),
              });

              const data = await response.json();
              
              if (data.success) {
                let message = `✅ User Created Successfully!\\n\\nName: ${name}\\nEmail: ${email}\\nPhone: ${phone}\\nMembership: ${membershipType}\\n\\nVerification email sent to ${email}`;
                if (data.user.tempPassword) {
                  message += `\\n\\n🔑 Temporary Password: ${data.user.tempPassword}\\n(User should change this after first login)`;
                }
                alert(message);
                fetchUsers(); // Refresh the list
              } else {
                alert(`❌ Error: ${data.message}`);
              }
            } catch (error) {
              alert(`❌ Failed to create user: ${error}`);
            }
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 lg:px-6 lg:py-3 rounded-2xl bg-iosBlue text-white text-sm lg:text-base font-medium hover:shadow-xl transition-all cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add New User
        </button>
      </header>

      {/* Filters & Search */}
      <div className="glass-card p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1C1C1E]/40" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input w-full pl-10 pr-4 py-2 lg:py-3 text-sm lg:text-base text-[#1C1C1E]"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto lg:overflow-visible">
            {(['All', 'Active', 'Inactive', 'Suspended'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  filterStatus === status
                    ? 'glass-chip-active'
                    : 'glass-button'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button 
            onClick={() => {
              alert(`📊 Exporting User Data\n\nGenerating CSV with:\n- User details (${filteredUsers.length} users)\n- Membership info\n- Workout statistics\n- Join dates\n\nAPI: /api/admin/users/export coming soon!`);
            }}
            className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-full glass-button text-sm cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {filteredUsers.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="glass-card p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(user.status)}`}>
                {user.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className={`px-2 py-1 rounded-lg font-medium ${getMembershipColor(user.membershipType)}`}>
                {user.membershipType}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-600">{user.workoutsCompleted} workouts</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-600">Joined {user.joinDate}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button 
                onClick={() => {
                  alert(`✏️ Edit User: ${user.name}\n\nCurrent Details:\n- Email: ${user.email}\n- Status: ${user.status}\n- Membership: ${user.membershipType}\n\nYou can:\n- Update profile info\n- Change membership tier\n- Modify status\n- Reset password\n\nAPI integration coming soon!`);
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-iosBlue/10 text-iosBlue text-xs font-medium hover:bg-iosBlue/20 transition-all cursor-pointer"
              >
                Edit
              </button>
              <button 
                onClick={() => {
                  alert(`👤 User Details: ${user.name}\n\n📧 ${user.email}\n📞 ${user.phone || 'N/A'}\n\n💪 Workouts: ${user.workoutsCompleted}\n📅 Joined: ${user.joinDate}\n🎫 ${user.membershipType} Member\n📊 Status: ${user.status}\n\nOpening detailed view...`);
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200 transition-all cursor-pointer"
              >
                View Details
              </button>
            </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block glass-card-strong border-white/20 shadow-depth overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/40 border-b border-slate-200/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Membership</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Workouts</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Join Date</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-200/30 hover:bg-white/30 transition-all"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-iosBlue to-iosPurple flex items-center justify-center text-white font-semibold">
                        {user.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <span className="font-medium text-slate-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getMembershipColor(user.membershipType)}`}>
                      {user.membershipType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-medium">{user.workoutsCompleted}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{user.joinDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={async () => {
                          const action = confirm(`👑 Promote ${user.name} to Admin?\n\nThis will:\n- Grant admin privileges\n- Send OTP to user's email\n- Require OTP verification\n\nProceed?`);
                          if (action) {
                            try {
                              const token = localStorage.getItem('authToken');
                              const response = await fetch('/api/admin/users/promote', {
                                method: 'POST',
                                headers: {
                                  'Authorization': `Bearer ${token}`,
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  userId: user.id,
                                  action: 'request',
                                }),
                              });
                              const data = await response.json();
                              if (data.success) {
                                const otp = prompt(`📧 OTP sent to ${user.email}\n\nEnter the 6-digit OTP:`);
                                if (otp) {
                                  const verifyResponse = await fetch('/api/admin/users/promote', {
                                    method: 'POST',
                                    headers: {
                                      'Authorization': `Bearer ${token}`,
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                      userId: user.id,
                                      action: 'verify',
                                      otp: otp,
                                    }),
                                  });
                                  const verifyData = await verifyResponse.json();
                                  if (verifyData.success) {
                                    alert(`✅ ${user.name} promoted to admin successfully!`);
                                    fetchUsers();
                                  } else {
                                    alert(`❌ Error: ${verifyData.message}`);
                                  }
                                }
                              } else {
                                alert(`❌ Error: ${data.message}`);
                              }
                            } catch (error) {
                              alert(`❌ Failed to promote user: ${error}`);
                            }
                          }
                        }}
                        className="p-2 rounded-lg hover:bg-white/50 transition-all cursor-pointer" 
                        aria-label="Promote to admin"
                        title="Promote to admin"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button 
                        onClick={() => {
                          alert(`✏️ Edit User: ${user.name}\n\nCurrent Details:\n- Email: ${user.email}\n- Status: ${user.status}\n- Membership: ${user.membershipType}\n- Workouts: ${user.workoutsCompleted}\n\nYou can:\n- Update profile info\n- Change membership tier\n- Modify status\n- Reset password\n\nAPI: PUT /api/admin/users/${user.id} coming soon!`);
                        }}
                        className="p-2 rounded-lg hover:bg-white/50 transition-all cursor-pointer" 
                        aria-label="Edit user"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                      <button 
                        onClick={async () => {
                          if (confirm(`⚠️ Delete User: ${user.name}?\n\nThis will:\n- Remove user account\n- Delete workout history\n- Cancel membership\n- Remove all data\n\nThis action cannot be undone!\n\nProceed with deletion?`)) {
                            try {
                              const token = localStorage.getItem('authToken');
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
                          }
                        }}
                        className="p-2 rounded-lg hover:bg-white/50 transition-all cursor-pointer" 
                        aria-label="Delete user"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-white/20 border-t border-slate-200/50 flex items-center justify-between">
          <p className="text-sm text-slate-600">Showing {filteredUsers.length} of {users.length} users</p>
          <div className="flex gap-2">
            <button 
              onClick={() => alert('⬅️ Previous page\n\nPagination coming soon!')} 
              className="px-3 py-1 rounded-lg bg-white/60 hover:bg-white/80 text-sm transition-all cursor-pointer"
            >
              Previous
            </button>
            <button className="px-3 py-1 rounded-lg bg-iosBlue text-white text-sm cursor-default">1</button>
            <button 
              onClick={() => alert('📄 Page 2\n\nPagination coming soon!')} 
              className="px-3 py-1 rounded-lg bg-white/60 hover:bg-white/80 text-sm transition-all cursor-pointer"
            >
              2
            </button>
            <button 
              onClick={() => alert('➡️ Next page\n\nPagination coming soon!')} 
              className="px-3 py-1 rounded-lg bg-white/60 hover:bg-white/80 text-sm transition-all cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </section>
  );
}
