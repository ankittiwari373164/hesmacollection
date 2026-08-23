export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl mb-8">Terms &amp; Conditions</h1>
      <div className="space-y-6 text-sm text-ink/75 leading-relaxed">
        <p>By accessing or using the Hesma Collection website, you agree to be bound by these Terms &amp; Conditions.</p>
        <Section title="Use of the site">
          You must be at least 18 years old, or using this site under the supervision of a parent or guardian, to place an order.
        </Section>
        <Section title="Product information">
          We strive to display product colours and details as accurately as possible; slight variation may occur due to screen settings and handcrafted nature of jewellery.
        </Section>
        <Section title="Pricing & availability">
          All prices are listed in INR and inclusive of applicable taxes. We reserve the right to modify prices and discontinue products without prior notice.
        </Section>
        <Section title="Orders & cancellation">
          Orders can be cancelled before they are shipped by contacting support. Once shipped, please refer to our Refund Policy.
        </Section>
        <Section title="Intellectual property">
          All content on this site, including images, logos, and text, is the property of Hesma Collection and may not be reproduced without permission.
        </Section>
        <Section title="Limitation of liability">
          Hesma Collection is not liable for indirect or consequential damages arising from the use of our products or website.
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
