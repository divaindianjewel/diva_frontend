export default function Component() {
  return (
    <div className="bg-background text-foreground p-8 sm:p-12 rounded-lg shadow-lg max-w-3xl mx-auto">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Billing Address</h2>
          <p>
            John Doe
            <br />
            123 Main St.
            <br />
            Anytown, CA 12345
            <br />
            United States
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold mb-4">Order #1234</h2>
          <p className="text-muted-foreground">June 15, 2023</p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Order Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-muted">
                <th className="text-left py-2 pr-4">Item</th>
                <th className="text-right py-2 pr-4">Qty</th>
                <th className="text-right py-2 pr-4">Unit Price</th>
                <th className="text-right py-2 pr-4">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-muted">
                <td className="py-4 pr-4">Widget A</td>
                <td className="text-right py-4 pr-4">2</td>
                <td className="text-right py-4 pr-4">$19.99</td>
                <td className="text-right py-4 pr-4">$39.98</td>
              </tr>
              <tr className="border-b border-muted">
                <td className="py-4 pr-4">Widget B</td>
                <td className="text-right py-4 pr-4">1</td>
                <td className="text-right py-4 pr-4">$29.99</td>
                <td className="text-right py-4 pr-4">$29.99</td>
              </tr>
              <tr className="border-b border-muted">
                <td className="py-4 pr-4">Widget C</td>
                <td className="text-right py-4 pr-4">3</td>
                <td className="text-right py-4 pr-4">$9.99</td>
                <td className="text-right py-4 pr-4">$29.97</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Payment Information</h2>
          <p>
            Payment Method: Visa ending in 1234
            <br />
            Due Date: June 30, 2023
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-muted-foreground">Subtotal:</div>
            <div>$99.94</div>
            <div className="text-muted-foreground">Discount:</div>
            <div>-$9.99</div>
            <div className="text-muted-foreground">Tax:</div>
            <div>$9.00</div>
            <div className="font-bold">Total:</div>
            <div className="font-bold">$98.95</div>
          </div>
        </div>
      </div>
    </div>
  );
}
