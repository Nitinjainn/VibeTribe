import React, { useState, useEffect } from "react"
import {
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Settings,
  Bell,
  Search,
  Filter,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Globe,
  Calendar,
  MessageSquare,
  Wallet
} from "lucide-react"
import Navbar from "./Navbar"

// Your existing EscrowAdminDecision component (unchanged)
const EscrowAdminDecision = () => {
  const [account, setAccount] = useState("")
  const [contract, setContract] = useState(null)
  const [payer, setPayer] = useState("")
  const [balance, setBalance] = useState("0")

  const escrowAddress = "0xae7c49a6d9AF8D2FFb9d6E0105C592a1194fB6FD"
  const adminAddress = "0xAF11b2E457530e960CE5801D23e88b2d4eB0E87d"

  const abi = [
    {
      inputs: [{ internalType: "address", name: "_payee", type: "address" }],
      stateMutability: "nonpayable",
      type: "constructor"
    },
    {
      inputs: [],
      name: "payer",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "releaseToAdmin",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "refundToPayer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "getBalance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function"
    }
  ]

  useEffect(() => {
    const init = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const { ethers } = await import("ethers")
          const provider = new ethers.BrowserProvider(window.ethereum)
          const signer = await provider.getSigner()
          const user = await signer.getAddress()

          const contractInstance = new ethers.Contract(
            escrowAddress,
            abi,
            signer
          )
          const payer = await contractInstance.payer()
          const bal = await contractInstance.getBalance()

          setContract(contractInstance)
          setAccount(user)
          setPayer(payer)
          setBalance(ethers.formatEther(bal))
        } catch (error) {
          console.error("Error initializing contract:", error)
        }
      }
    }

    init()
  }, [])

  const releaseToAdmin = async () => {
    try {
      const tx = await contract.releaseToAdmin()
      await tx.wait()
      alert("Released to admin.")
    } catch (err) {
      console.error(err)
      alert("Error during release.")
    }
  }

  const refundToPayer = async () => {
    try {
      const tx = await contract.refundToPayer()
      await tx.wait()
      alert("Refunded to payer.")
    } catch (err) {
      console.error(err)
      alert("Error during refund.")
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg p-6 mt-10 rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">
        Admin Decision Panel
      </h2>
      <p>
        <strong>Your Wallet:</strong> {account}
      </p>
      <p>
        <strong>Payer Address:</strong> {payer}
      </p>
      <p>
        <strong>Escrow Balance:</strong> {balance} ETH
      </p>

      {account.toLowerCase() === adminAddress.toLowerCase() && (
        <div className="mt-6 space-y-3">
          <button
            onClick={releaseToAdmin}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
          >
            ✅ Release to Admin
          </button>
          <button
            onClick={refundToPayer}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
          >
            🔄 Refund to VPS (Payer)
          </button>
        </div>
      )}
    </div>
  )
}

// Mock data for demonstration
const mockData = {
  stats: {
    totalUsers: 12847,
    activeBookings: 324,
    totalRevenue: 2847.92,
    disputesCases: 12
  },
  users: [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      status: "active",
      walletAddress: "0x1234...5678",
      joinDate: "2024-01-15",
      totalSpent: 1250.5
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      status: "suspended",
      walletAddress: "0xabcd...efgh",
      joinDate: "2024-02-20",
      totalSpent: 890.25
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol@example.com",
      status: "active",
      walletAddress: "0x9876...5432",
      joinDate: "2024-03-10",
      totalSpent: 2340.75
    }
  ],
  bookings: [
    {
      id: 1,
      user: "Alice Johnson",
      destination: "Bali, Indonesia",
      dates: "2024-07-15 - 2024-07-22",
      status: "confirmed",
      amount: 1200.0
    },
    {
      id: 2,
      user: "Bob Smith",
      destination: "Tokyo, Japan",
      dates: "2024-08-01 - 2024-08-08",
      status: "pending",
      amount: 1800.5
    },
    {
      id: 3,
      user: "Carol Davis",
      destination: "Paris, France",
      dates: "2024-07-20 - 2024-07-27",
      status: "dispute",
      amount: 950.25
    }
  ],
  disputes: [
    {
      id: 1,
      user: "Carol Davis",
      issue: "Accommodation not as described",
      status: "investigating",
      amount: 950.25,
      date: "2024-07-08"
    },
    {
      id: 2,
      user: "David Wilson",
      issue: "Flight cancellation dispute",
      status: "resolved",
      amount: 650.0,
      date: "2024-07-05"
    }
  ]
}

const VibeTribeAdmin = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New dispute filed by Carol Davis",
      type: "warning",
      time: "2 hours ago"
    },
    {
      id: 2,
      message: "Payment verification required for booking #1234",
      type: "info",
      time: "4 hours ago"
    },
    {
      id: 3,
      message: "System maintenance scheduled for tonight",
      type: "info",
      time: "6 hours ago"
    }
  ])

  const [users, setUsers] = useState(mockData.users)
  const [bookings, setBookings] = useState(mockData.bookings)

  const StatCard = ({ title, value, icon: Icon }) => (
    <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-teal-100 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-teal-700">{value}</p>
        </div>
        <Icon className="w-8 h-8 text-teal-600" />
      </div>
    </div>
  )

  const handleUserStatusChange = (userId, newStatus) => {
    setUsers(
      users.map(user =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    )
  }

  const handleBookingStatusChange = (bookingId, newStatus) => {
    setBookings(
      bookings.map(booking =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    )
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-teal-700 mb-8">
        Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={mockData.stats.totalUsers.toLocaleString()}
          icon={Users}
        />
        <StatCard
          title="Active Bookings"
          value={mockData.stats.activeBookings}
          icon={Calendar}
        />
        <StatCard
          title="Total Revenue"
          value={`$${mockData.stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatCard
          title="Dispute Cases"
          value={mockData.stats.disputesCases}
          icon={AlertTriangle}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-teal-100 shadow-lg">
          <h3 className="text-xl font-bold text-teal-700 mb-4">
            Recent Bookings
          </h3>
          <div className="space-y-3">
            {bookings.slice(0, 3).map(booking => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-teal-50/50 rounded-lg border border-teal-100"
              >
                <div>
                  <p className="font-semibold text-teal-700">{booking.user}</p>
                  <p className="text-sm text-gray-600">{booking.destination}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-teal-700">${booking.amount}</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-teal-100 shadow-lg">
          <h3 className="text-xl font-bold text-teal-700 mb-4">
            System Notifications
          </h3>
          <div className="space-y-3">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className="flex items-start space-x-3 p-4 bg-teal-50/50 rounded-lg border border-teal-100"
              >
                <Bell
                  className={`w-5 h-5 mt-0.5 ${
                    notification.type === "warning"
                      ? "text-yellow-500"
                      : "text-teal-600"
                  }`}
                />
                <div>
                  <p className="text-sm text-gray-700">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-teal-700">User Management</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-teal-100 rounded-lg focus:ring-2 focus:ring-teal-500/40 focus:border-transparent bg-white/80"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors duration-300">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-xl border border-teal-100 shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-teal-50/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                Wallet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                Total Spent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-teal-100">
            {users
              .filter(
                user =>
                  user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(user => (
                <tr key={user.id} className="hover:bg-teal-50/50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-teal-700">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 font-mono">
                      {user.walletAddress}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-700 font-medium">
                    ${user.totalSpent.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-teal-600 hover:text-teal-800 transition-colors duration-150">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        handleUserStatusChange(
                          user.id,
                          user.status === "active" ? "suspended" : "active"
                        )
                      }
                      className="text-yellow-600 hover:text-yellow-700 transition-colors duration-150"
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderBookingManagement = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Booking Management</h2>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Destination
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map(booking => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{booking.id.toString().padStart(4, "0")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.user}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.destination}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.dates}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${booking.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() =>
                      handleBookingStatusChange(booking.id, "confirmed")
                    }
                    className="text-green-600 hover:text-green-900"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      handleBookingStatusChange(booking.id, "cancelled")
                    }
                    className="text-red-600 hover:text-red-900"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderDisputeManagement = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Dispute Management</h2>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dispute ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Issue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockData.disputes.map(dispute => (
              <tr key={dispute.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #D{dispute.id.toString().padStart(3, "0")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {dispute.user}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {dispute.issue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${dispute.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      dispute.status === "resolved"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {dispute.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {dispute.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderEscrowManagement = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Escrow Management</h2>
      <EscrowAdminDecision />

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Recent Escrow Transactions
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900">Escrow Release</p>
              <p className="text-sm text-gray-600">Booking #1234 - Bali Trip</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">2.5 ETH</p>
              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Released
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900">Escrow Refund</p>
              <p className="text-sm text-gray-600">
                Booking #1235 - Tokyo Trip
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">1.8 ETH</p>
              <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Refunded
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp },
    { id: "users", label: "Users", icon: Users },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "disputes", label: "Disputes", icon: AlertTriangle },
    { id: "escrow", label: "Escrow", icon: Wallet },
    { id: "settings", label: "Settings", icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/50 to-white relative">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24%,rgba(13,148,136,0.2)_25%,rgba(13,148,136,0.2)_26%,transparent_27%,transparent_74%,rgba(13,148,136,0.2)_75%,rgba(13,148,136,0.2)_76%,transparent_77%,transparent)] bg-[length:40px_40px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(13,148,136,0.2)_25%,rgba(13,148,136,0.2)_26%,transparent_27%,transparent_74%,rgba(13,148,136,0.2)_75%,rgba(13,148,136,0.2)_76%,transparent_77%,transparent)] bg-[length:40px_40px]"></div>
      </div>

      <Navbar />

      <div className="flex pt-20">
        {/* Sidebar */}
        <div className="w-64 bg-white/80 backdrop-blur-md border-r border-teal-100 h-[calc(100vh-5rem)] fixed left-0 top-20">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-teal-700">
                VibeTribe Admin
              </h1>
            </div>

            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-teal-100/50 text-teal-700 border-r-2 border-teal-700"
                      : "text-gray-600 hover:bg-teal-50"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64">
          <div className="p-8">
            {activeTab === "dashboard" && renderDashboard()}
            {activeTab === "users" && renderUserManagement()}
            {activeTab === "bookings" && renderBookingManagement()}
            {activeTab === "disputes" && renderDisputeManagement()}
            {activeTab === "escrow" && renderEscrowManagement()}
            {activeTab === "settings" && (
              <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-teal-100 shadow-lg">
                <h2 className="text-2xl font-bold text-teal-700 mb-4">
                  Settings
                </h2>
                <p className="text-gray-600">
                  Platform settings and configuration options will be available
                  here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VibeTribeAdmin
