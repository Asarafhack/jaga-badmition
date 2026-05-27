import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/PolicyPage";

export const Route = createFileRoute("/shipping")({
  head: () => ({ meta: [{ title: "Shipping Policy — Jaga Traders" }, { name: "description", content: "Shipping rates, delivery times and tracking for Jaga Traders." }] }),
  component: () => (
    <PolicyPage eyebrow="LOGISTICS" title="SHIPPING POLICY" sections={[
      { h: "Delivery Timelines", p: "Orders ship within 24 hours from our Bhavani warehouse. Standard delivery across India: 3–6 business days. Express: 1–3 business days in metro cities." },
      { h: "Shipping Charges", p: "Free shipping on all orders above ₹2,999. Below that, a flat ₹199 applies. International shipping is calculated at checkout based on destination and weight." },
      { h: "Order Tracking", p: "Once dispatched, you'll receive an email and WhatsApp message with a tracking link. You can also track from your account page." },
      { h: "Cash on Delivery", p: "COD is available across India for orders up to ₹15,000. A small handling fee of ₹49 applies on COD orders." },
      { h: "International Orders", p: "We ship to 40+ countries. Customs duties and taxes are the responsibility of the recipient." },
    ]} />
  ),
});