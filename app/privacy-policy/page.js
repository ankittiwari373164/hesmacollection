export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl mb-8">Privacy Policy</h1>
      <div className="space-y-6 text-sm text-ink/75 leading-relaxed">
        <p>Last updated: August 2026. Hesma Collection ("we", "us") respects your privacy and is committed to protecting the personal data you share with us.</p>
        <Section title="Information we collect">
          We collect information you provide directly — name, email, phone number, shipping address, and order history — as well as data collected automatically, such as browser type and pages visited, to improve our service.
        </Section>
        <Section title="How we use your information">
          Your data is used to process orders, provide customer support, send order updates, and — with your consent — share promotional offers. We never sell your personal data to third parties.
        </Section>
        <Section title="Payment information">
          Online payments are processed securely by our payment partners (Razorpay/Stripe). We do not store your card details on our servers.
        </Section>
        <Section title="Cookies">
          We use cookies and local storage to remember your cart, wishlist, and login session, and to understand how you use our site.
        </Section>
        <Section title="Your rights">
          You may request access to, correction of, or deletion of your personal data at any time by contacting our support team.
        </Section>
        <Section title="Contact us">
          For privacy-related queries, write to care@hesmacollection.com.
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
