// FinancialTable.tsx
import React from "react";



const FinancialTable: React.FC = () => {
  return (
    <div className="tabular--wrapper">
      {/* <h3 className="main--title">Finance data</h3> */}
      <div className="table-container">
        <h1 className="pt-8 text-xl">Sales</h1>
        <table>
          <thead className="bg-[#25aae1]">
            <tr>
              <th>Category </th>
              <th>Price</th>
              <th>Total Quantity</th>
              <th>Sold Tickets</th>
              <th>Available Tickets</th>
              <th>Pay Out Due</th>
              {/* <th>Pay Due After Refund</th> */}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Regular</td>
              <td>$50</td>
              <td>200</td>
              <td>200</td>
              <td>2</td>
              <td>$20000</td>
              {/* <td>
                <button>Edit</button>
              </td> */}
            </tr>
            <tr>
              <td>VIP</td>
              <td>$80</td>
              <td>1500</td>
              <td>150</td>
              <td>0</td>
              <td>$30000</td>
              {/* <td>
                <button>Edit</button>
              </td> */}
            </tr>
            <tr>
              <td>VVIP</td>
              <td>$100</td>
              <td>5000</td>
              <td>2000</td>
              <td>0</td>
              <td>$23000</td>
              {/* <td>
                <button>Edit</button>
              </td> */}
            </tr>
          </tbody>
          <tfoot className="bg-[#25aae1]">
            <tr>
              <td colSpan={7}>Total Amount: $3,700</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="table-container">
        <h1 className="pt-8 text-xl">Refunds</h1>
        <table>
          <thead className="bg-[#25aae1]">
            <tr>
              <th>Ticket Category Refunded </th>
              <th>Price</th>
              <th>Quantity Refunded</th>
              <th>Refunds</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Regular</td>
              <td>$15</td>
              <td>3</td>
              <td>$45</td>
            </tr>
            <tr>
              <td>VIP</td>
              <td>$20</td>
              <td>1</td>
              <td>$20</td>
            </tr>
          </tbody>
          <tfoot className="bg-[#25aae1]">
            <tr>
              <td colSpan={7}>Total Refunded: $65</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="table-container">
        <h1 className="pt-8 text-xl">Sales After Refunds</h1>
        <table>
          <thead className="bg-[#25aae1]">
            <tr>
              <th>Payouts Due After Refunds </th>
              <th>$3,700</th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="table-container">
        <h1 className="pt-8 text-xl">Payouts</h1>
        <table>
          <thead className="bg-[#25aae1]">
            <tr>
              <th>Date of Payouts </th>
              <th>Amount Paid Out</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>20 - March - 2024</td>
              <td>$50</td>
            </tr>
            <tr>
              <td>26 - March-2024</td>
              <td>$150</td>
            </tr>
            <tr>
              <td>29 - March-2024</td>
              <td>$1500</td>
            </tr>
          </tbody>
          <tfoot className="bg-[#25aae1]">
            <tr>
              <td colSpan={7}>Payouts Made: $1700</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="table-container pt-8">
        <table>
          <thead className="bg-[#25aae1]">
            <tr>
              <th>Due Date </th>
              <th>Payout Due</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>08 - April - 2024</td>
              <td>$2050.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialTable;
