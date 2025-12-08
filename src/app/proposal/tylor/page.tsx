// components/Packages.tsx

export default function Packages() {
  return (
    <section className="grid gap-6 md:grid-cols-3 p-6">
      {/* Package 1 */}
      <div className="border rounded-2xl p-6 shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-3">Starter Package</h2>
        <p className="text-3xl font-bold mb-4">$300</p>
        <ul className="space-y-2 text-sm">
          <li>3 logo variations</li>
        </ul>
      </div>

      {/* Package 2 */}
      <div className="border rounded-2xl p-6 shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-3">Pro Package</h2>
        <p className="text-3xl font-bold mb-4">$500</p>
        <ul className="space-y-2 text-sm">
          <li>5 logo variations</li>
        </ul>
      </div>

      {/* Package 3 */}
      <div className="border rounded-2xl p-6 shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-3">Full Month Package</h2>
        <p className="text-3xl font-bold mb-4">$1200</p>

        <ul className="space-y-2 text-sm">
          <li>1 month collaboration</li>
          <li>4 hours per day for 30 business days</li>
          <li>Week 1 and Week 2 focused on finishing the logo</li>
          <li>Brand guidelines included</li>
          <li>Color system</li>
          <li>Typography</li>
          <li>3D mockups</li>
          <li>Logo usage rules</li>
          <li>Aspect ratio instructions</li>
          <li>Horizontal and vertical versions</li>
          <li>Badge shape version if possible</li>
          <li>Text logo version if needed</li>
        </ul>
      </div>
    </section>
  );
}
