import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { FaEye, FaTimes, FaArrowLeft, FaUsers } from "react-icons/fa";
import moticketlogo from "../../assets/images/moticketlogo.png";

interface TicketData {
  id: string;
  user_id: string;
  lname: string;
  fname: string;
  email: string;
  qr: string;
  ticket_ref: string;
  pdf_file: string;
  event_id: string;
  ticket_class: string;
  amount: string; // This is the price of ONE ticket
  pay_reference: string;
  payment_channel: string;
  buy_date_time: string;
  channel: string;
  used: string;
  used_date_time: string;
  processing_agent: string | null;
}

interface TransactionData {
  pay_reference: string;
  ticketCount: number;
  usedTickets: number;
  tickets: TicketData[];
  customerName: string;
  customerEmail: string;
  purchaseDate: string;
  ticketClasses: string[];
  // Removed transactionTotal since we're not calculating it
}

interface FinancialTableProps {
  eventid: string;
  onBack: () => void;
}

const FinancialTable: React.FC<FinancialTableProps> = ({ eventid, onBack }) => {
  const [ticketData, setTicketData] = useState<TicketData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"transactions" | "single">(
    "transactions",
  );
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionData | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASEURL}/eventhost/ticketsales_report/${eventid}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch ticket data");
        }
        const data = await response.json();
        console.log(data);
        setTicketData(data);

        // Process data to group by payment reference
        const transactionMap = new Map<string, TransactionData>();

        data.forEach((ticket: TicketData) => {
          const ref = ticket.pay_reference;

          if (!transactionMap.has(ref)) {
            transactionMap.set(ref, {
              pay_reference: ref,
              ticketCount: 0,
              usedTickets: 0,
              tickets: [],
              customerName: `${ticket.fname} ${ticket.lname}`,
              customerEmail: ticket.email,
              purchaseDate: ticket.buy_date_time,
              ticketClasses: [],
            });
          }

          const transaction = transactionMap.get(ref)!;
          transaction.ticketCount += 1;

          if (ticket.used === "1") {
            transaction.usedTickets += 1;
          }

          transaction.tickets.push(ticket);

          if (!transaction.ticketClasses.includes(ticket.ticket_class)) {
            transaction.ticketClasses.push(ticket.ticket_class);
          }
        });

        setTransactions(Array.from(transactionMap.values()));
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    if (eventid) {
      fetchTicketData();
    }
  }, [eventid]);

  // Format currency to Naira
  const formatNaira = (amount: number | string) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return `₦${numAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };

  // Get ticket price for display (shows the price of one ticket in the transaction)
  const getTicketPrice = (transaction: TransactionData) => {
    if (transaction.tickets.length > 0) {
      // Just show the price of the first ticket
      return formatNaira(transaction.tickets[0].amount);
    }
    return "₦0.00";
  };

  // Export to Excel - both transactions and detailed tickets
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Transactions sheet
    const transactionsWorksheet = XLSX.utils.json_to_sheet(
      transactions.map((transaction) => ({
        "Payment Reference": transaction.pay_reference,
        "Customer Name": transaction.customerName,
        "Customer Email": transaction.customerEmail,
        "Ticket Price": getTicketPrice(transaction),
        "Number of Tickets": transaction.ticketCount,
        "Used Tickets": transaction.usedTickets,
        "Available Tickets": transaction.ticketCount - transaction.usedTickets,
        "Purchase Date": transaction.purchaseDate.split(" ")[0],
        "Ticket Classes": transaction.ticketClasses.join(", "),
      })),
    );
    XLSX.utils.book_append_sheet(
      workbook,
      transactionsWorksheet,
      "Transactions",
    );

    // Detailed tickets sheet
    const ticketsWorksheet = XLSX.utils.json_to_sheet(
      ticketData.map((ticket) => ({
        "Full Name": `${ticket.fname} ${ticket.lname}`,
        "Payment Reference": ticket.pay_reference,
        Category: ticket.ticket_class,
        "Ticket Price": formatNaira(ticket.amount),
        Status: ticket.used === "1" ? "Used" : "Not Used",
        "Purchase Date": ticket.buy_date_time.split(" ")[0],
        Email: ticket.email,
        Phone: ticket.user_id,
        "Ticket Reference": ticket.ticket_ref,
      })),
    );
    XLSX.utils.book_append_sheet(workbook, ticketsWorksheet, "Ticket Details");

    XLSX.writeFile(workbook, "financial_report.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    const tableColumn = [
      "Payment Reference",
      "Customer",
      "Ticket Price",
      "Tickets",
      "Status",
      "Date",
    ];

    const tableRows = transactions.map((transaction) => [
      transaction.pay_reference,
      transaction.customerName,
      getTicketPrice(transaction),
      `${transaction.ticketCount} (${transaction.usedTickets} used)`,
      transaction.usedTickets === transaction.ticketCount
        ? "All Used"
        : transaction.usedTickets > 0
          ? "Partially Used"
          : "None Used",
      transaction.purchaseDate.split(" ")[0],
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      margin: { top: 30, left: 10, right: 10 },
      styles: {
        fontSize: 10,
        cellPadding: { top: 4, bottom: 4, left: 2, right: 2 },
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: 255,
        halign: "center",
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 35 }, // Payment Ref
        1: { cellWidth: 40 }, // Customer
        2: { cellWidth: 25, halign: "right" }, // Ticket Price
        3: { cellWidth: 25, halign: "center" }, // Tickets
        4: { cellWidth: 25, halign: "center" }, // Status
        5: { cellWidth: 25 }, // Date
      },
      theme: "striped",
      alternateRowStyles: { fillColor: [245, 245, 245] },
      rowPageBreak: "avoid",
    });

    doc.setFontSize(14);
    doc.text("Financial Transactions Report", 14, 20);
    doc.save("financial_report.pdf");
  };

  // View transaction details
  const handleViewTransaction = (transaction: TransactionData) => {
    setSelectedTransaction(transaction);
    setViewMode("single");
  };

  // View individual ticket
  const handleViewTicket = (ticket: TicketData) => {
    setSelectedTicket(ticket);
    setViewMode("single");
  };

  // Return to list view
  const handleBackToList = () => {
    setViewMode("transactions");
    setSelectedTransaction(null);
    setSelectedTicket(null);
  };

  // Format date for display
  const formatDate = (dateTime: string) => {
    if (dateTime === "0000-00-00 00:00:00") return "N/A";
    const [date, time] = dateTime.split(" ");
    return `${date} at ${time.substring(0, 5)}`;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md text-center">
        Error: {error}
      </div>
    );

  // Single Transaction View
  if (viewMode === "single" && selectedTransaction) {
    const firstTicket = selectedTransaction.tickets[0];

    return (
      <div className="p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBackToList}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" /> Back to All Transactions
          </button>
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <FaTimes className="mr-1" /> Close Report
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-center mb-8">
            <img
              src={moticketlogo}
              alt="MoTicket Logo"
              className="h-24 object-contain"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold text-gray-500 mb-2">Ticket Price</h3>
              <p className="text-xl font-bold">
                {firstTicket ? formatNaira(firstTicket.amount) : "₦0.00"}
              </p>
              <p className="text-sm text-gray-600 mt-1">Per ticket</p>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold text-gray-500 mb-2">
                Ticket Status
              </h3>
              <p className="text-xl">{selectedTransaction.usedTickets} used</p>
              <p className="text-sm text-gray-600 mt-1">
                {selectedTransaction.ticketCount -
                  selectedTransaction.usedTickets}{" "}
                available
              </p>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold text-gray-500 mb-2">
                Purchase Date
              </h3>
              <p className="text-xl">
                {formatDate(selectedTransaction.purchaseDate)}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-4">Customer Information</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ticket Classes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {selectedTransaction.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap break-all">
                      {selectedTransaction.customerEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap break-all">
                      {selectedTransaction.pay_reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {selectedTransaction.ticketClasses.join(", ")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-4">
              Tickets in this Transaction ({selectedTransaction.tickets.length})
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ticket Ref
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ticket Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedTransaction.tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ticket.ticket_ref}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ticket.ticket_class}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatNaira(ticket.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            ticket.used === "1"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {ticket.used === "1" ? "Used" : "Not Used"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewTicket(ticket)}
                          className="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleBackToList}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Back to Transactions
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Individual Ticket View
  if (viewMode === "single" && selectedTicket) {
    return (
      <div className="p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => {
              // Find the transaction this ticket belongs to
              const transaction = transactions.find((t) =>
                t.tickets.some((ticket) => ticket.id === selectedTicket.id),
              );
              if (transaction) {
                setSelectedTransaction(transaction);
                setSelectedTicket(null);
              } else {
                handleBackToList();
              }
            }}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" /> Back to Transaction
          </button>
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <FaTimes className="mr-1" /> Close Report
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-center mb-8">
            <img
              src={moticketlogo}
              alt="MoTicket Logo"
              className="h-24 object-contain"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold text-gray-500 mb-2">Ticket Price</h3>
              <p className="text-xl font-bold">
                {formatNaira(selectedTicket.amount)}
              </p>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold text-gray-500 mb-2">
                Purchase Date
              </h3>
              <p className="text-xl">
                {formatDate(selectedTicket.buy_date_time)}
              </p>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold text-gray-500 mb-2">
                Payment Channel
              </h3>
              <p className="text-xl">
                {selectedTicket.payment_channel || "Not specified"}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-4">
              Ticket Holder Information
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Full Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ticket Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">{`${selectedTicket.fname} ${selectedTicket.lname}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap break-all">
                      {selectedTicket.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {selectedTicket.user_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {selectedTicket.ticket_class}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatNaira(selectedTicket.amount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold text-gray-500 mb-2">
                Payment Reference
              </h3>
              <p className="text-lg break-all">
                {selectedTicket.pay_reference}
              </p>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold text-gray-500 mb-2">
                Ticket Reference
              </h3>
              <p className="text-lg">{selectedTicket.ticket_ref}</p>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold text-gray-500 mb-2">Status</h3>
              <p className="text-lg">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedTicket.used === "1"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {selectedTicket.used === "1" ? "Used" : "Not Used"}
                </span>
              </p>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold text-gray-500 mb-2">
                {selectedTicket.used === "1" ? "Used On" : "Valid Until"}
              </h3>
              <p className="text-lg">
                {selectedTicket.used === "1"
                  ? formatDate(selectedTicket.used_date_time)
                  : "Event Date"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Transactions List View
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">
          Financial Transactions
        </h1>
        {transactions.length > 0 && (
          <div className="flex space-x-3">
            <button
              onClick={exportToExcel}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
            >
              <span>Export to Excel</span>
            </button>
            <button
              onClick={exportToPDF}
              className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              <span>Export to PDF</span>
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#25aae1]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Payment Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Ticket Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Tickets
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Purchase Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr
                    key={transaction.pay_reference}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.pay_reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUsers className="text-gray-400 mr-2" />
                        <div>
                          <div className="font-medium">
                            {transaction.customerName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.customerEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold">
                        {getTicketPrice(transaction)}
                      </div>
                      <div className="text-sm text-gray-500">Per ticket</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">
                        {transaction.ticketCount} tickets
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.usedTickets} used •{" "}
                        {transaction.ticketCount - transaction.usedTickets}{" "}
                        available
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.usedTickets === transaction.ticketCount
                            ? "bg-green-100 text-green-800"
                            : transaction.usedTickets > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {transaction.usedTickets === transaction.ticketCount
                          ? "All Used"
                          : transaction.usedTickets > 0
                            ? "Partially Used"
                            : "None Used"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.purchaseDate.split(" ")[0]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewTransaction(transaction)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Transaction Details"
                      >
                        <FaEye className="text-lg" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="w-16 h-16 text-gray-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">
                        No Transaction Data Found
                      </h3>
                      <p className="text-gray-500">
                        There are no ticket sales for this event yet.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      {transactions.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Transactions:</span>
              <span className="font-semibold ml-2">{transactions.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Total Tickets Sold:</span>
              <span className="font-semibold ml-2">
                {transactions.reduce((sum, t) => sum + t.ticketCount, 0)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Used Tickets:</span>
              <span className="font-semibold ml-2">
                {transactions.reduce((sum, t) => sum + t.usedTickets, 0)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialTable;
