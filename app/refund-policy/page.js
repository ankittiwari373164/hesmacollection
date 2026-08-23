export default function RefundPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl mb-8">Refund &amp; Return Policy</h1>
      <div className="space-y-6 text-sm text-ink/75 leading-relaxed">
        <Section title="7-day easy returns">
          We accept returns within 7 days of delivery for unused, unworn items in their original packaging with tags intact.
        </Section>
        <Section title="Non-returnable items">
          Earrings and any personal-care jewellery are non-returnable for hygiene reasons unless defective on arrival.
        </Section>
        <Section title="How to initiate a return">
          Go to My Account → Orders, or contact support with your order ID and reason for return. We'll arrange a reverse pickup where available.
        </Section>
        <Section title="Refund timeline">
          Once we receive and inspect the returned item, refunds are processed within 5–7 business days to the original payment method. Cash on Delivery orders are refunded via bank transfer or store credit.
        </Section>
        <Section title="Damaged or wrong item">
          If you receive a damaged or incorrect item, please share unboxing photos within 48 hours of delivery for a free replacement or full refund.
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="font-display text-xl mb-2 text-ink">{title}</h2>
      <p>{children}</p>
    </div>
  );
}
