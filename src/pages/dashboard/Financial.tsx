import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

interface TicketCategory {
  id: string;
  event_id: string;
  name: string;
  price: string;
  discount_price: string;
  wallet_discount: string;
  quantity: string;
  initial_quantity: string;
  noofpeople: string;
  cat_Image: string;
  Currency: string;
}

const FinancialTable: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { sn } = useParams();
  const [tickets, setTickets] = useState<TicketCategory[]>([]);
  const title = location.state?.title || "Sales Report"; // Get title from state

  useEffect(() => {
    if (sn) {
      fetch(
        `https://moloyal.com/test/mosave-ng/script/api/eventhost/sales_report/${sn}`
      )
        .then((response) => response.json())
        .then((data) => setTickets(data))
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [sn]);

  return (
    <div className="tabular--wrapper">
      <div className="table-container">
        <h1 className="pt-8 text-xl text-[#25aae1]">
          {title} -- Sales Report{" "}
        </h1>
        <table>
          <thead className="bg-[#25aae1]">
            <tr>
              <th>Category</th>
              <th>Price</th>
              <th>Total Quantity</th>
              <th>Sold Tickets</th>
              <th>Available Tickets</th>
              <th>Pay Out Due</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => {
              const price = parseFloat(ticket.price);
              const initialQuantity = parseInt(ticket.initial_quantity, 10);
              const availableQuantity = parseInt(ticket.quantity, 10);
              const soldTickets = initialQuantity - availableQuantity;
              const payoutDue = soldTickets * price; // Excluding booking fee

              return (
                <tr key={ticket.id}>
                  <td>{ticket.name}</td>
                  <td>₦{price.toFixed(2)}</td>
                  <td>{initialQuantity}</td>
                  <td>{soldTickets}</td>
                  <td>{availableQuantity}</td>
                  <td>₦{payoutDue.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-[#25aae1]">
            <tr>
              <td colSpan={6}>
                Total Amount: ₦
                {tickets
                  .reduce((total, ticket) => {
                    const price = parseFloat(ticket.price);
                    const soldTickets =
                      parseInt(ticket.initial_quantity, 10) -
                      parseInt(ticket.quantity, 10);
                    return total + soldTickets * price;
                  }, 0)
                  .toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
        <button
          onClick={() => navigate("/dashboard#")}
          className="py-2 px-6 bg-[#c10006]"
        >
          Back to dashboard
        </button>
      </div>
    </div>
  );
};

export default FinancialTable;
