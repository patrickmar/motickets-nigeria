import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { FaEye, FaTimes, FaArrowLeft } from "react-icons/fa";
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
  amount: string;
  pay_reference: string;
  payment_channel: string;
  buy_date_time: string;
  channel: string;
  used: string;
  used_date_time: string;
  processing_agent: string | null;
}

interface FinancialTableProps {
  eventid: string;
  onBack: () => void;
}

const FinancialTable: React.FC<FinancialTableProps> = ({ eventid, onBack }) => {
  const [ticketData, setTicketData] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "single">("list");
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [viewingFinancialReport, setViewingFinancialReport] =
    useState<boolean>(false);

  // Fetch data from API
  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASEURL}/eventhost/ticketsales_report/${eventid}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch ticket data");
        }
        const data = await response.json();
        console.log(data);
        setTicketData(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    if (eventid) {
      fetchTicketData();
    }
  }, [eventid]);

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      ticketData.map((ticket) => ({
        "Full Name": `${ticket.fname} ${ticket.lname}`,
        "Payment Reference": ticket.pay_reference,
        Category: ticket.ticket_class,
        Amount: `£${parseFloat(ticket.amount).toFixed(2)}`,
        Status: ticket.used === "1" ? "Used" : "Not Used",
        "Purchase Date": ticket.buy_date_time.split(" ")[0],
        Email: ticket.email,
        Phone: ticket.user_id,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");
    XLSX.writeFile(workbook, "ticket_data.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    const tableColumn = [
      "Full Name",
      "Payment Reference",
      "Category",
      "Amount (£)",
      "Status",
      "Date",
    ];

    const tableRows = ticketData.map((ticket) => [
      `${ticket.fname} ${ticket.lname}`,
      ticket.pay_reference,
      ticket.ticket_class,
      parseFloat(ticket.amount).toFixed(2), // Keep raw number for better alignment
      ticket.used === "1" ? "Used" : "Not Used",
      ticket.buy_date_time.split(" ")[0],
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
        0: { cellWidth: 35 }, // Full Name
        1: { cellWidth: 45 }, // Payment Ref
        2: { cellWidth: 25 }, // Category
        3: { cellWidth: 20, halign: "right" }, // Amount
        4: { cellWidth: 25, halign: "center" }, // Status
        5: { cellWidth: 30 }, // Date
      },
      theme: "striped",
      alternateRowStyles: { fillColor: [245, 245, 245] },
      rowPageBreak: "avoid",
    });

    doc.setFontSize(14);
    doc.text("Ticket Sales Report", 14, 20);
    doc.save("ticket_data.pdf");
  };

  // View single ticket
  const handleViewTicket = (ticket: TicketData) => {
    setSelectedTicket(ticket);
    setViewMode("single");
  };

  // Return to list view
  const handleBackToList = () => {
    setViewMode("list");
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

  // Single Ticket View
  if (viewMode === "single" && selectedTicket) {
    return (
      <div className="p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBackToList}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" /> Back to All Tickets
          </button>
          <button
            onClick={onBack} // This will close the entire FinancialTable modal
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
              <h3 className="font-semibold text-gray-500 mb-2">
                Ticket Amount
              </h3>
              <p className="text-xl font-bold">
                £{parseFloat(selectedTicket.amount).toFixed(2)}
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
                      Amount
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
                      £{parseFloat(selectedTicket.amount).toFixed(2)}
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

  // List View
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Ticket Management</h1>
        {ticketData.length > 0 && (
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
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Payment Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Amount
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
              {ticketData.length > 0 ? (
                ticketData.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{`${ticket.fname} ${ticket.lname}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ticket.pay_reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ticket.ticket_class}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      £{parseFloat(ticket.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ticket.used === "1"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {ticket.used === "1" ? "Used" : "Not Used"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ticket.buy_date_time.split(" ")[0]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewTicket(ticket)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
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
                        No Ticket Data Found
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
    </div>
  );
};

export default FinancialTable;
