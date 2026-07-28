"use client";
import { motion } from "framer-motion";

const rows = [
  {
    name: "Delivery Capture",
    body: "Record every load at the scale house with digital chain-of-custody.",
    detail: "Integrates with existing scale hardware and accounting systems including Agvance and SSI.",
  },
  {
    name: "Grade Arbitration",
    body: "Resolve quality disputes with a standardized, transparent review process.",
    detail: "Final say rests with the state-licensed inspector. Disputes are typically resolved within 24 hours of delivery.",
  },
  {
    name: "Settlement Statements",
    body: "Issue clear, accurate statements to farmer-members as soon as the grade is verified.",
    detail: "Automated PDF generation and distribution. No manual entry required between the scale and the office.",
  },
];

export default function Capabilities() {
  return (
    <motion.section
      id="capabilities"
      className="capabilities-section"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="capabilities-inner">
        <div className="capabilities-table" role="list">
          {rows.map((row, i) => (
            <motion.div
              key={row.name}
              className="capabilities-row"
              role="listitem"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
            >
              <div className="capabilities-row-left">
                <h3 className="capabilities-name">{row.name}</h3>
                <p className="capabilities-body">{row.body}</p>
              </div>
              <div className="capabilities-row-right">
                <p className="capabilities-detail">{row.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}