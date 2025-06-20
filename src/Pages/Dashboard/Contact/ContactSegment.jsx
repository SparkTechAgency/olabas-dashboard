import { Segmented } from "antd";
import { useState } from "react";
import Contact from "./Contact";
import Social from "./Social";

function ContactSegment() {
  const [showSelected, setShowSelected] = useState("Contact");
  return (
    <div>
      <Segmented
        options={["Contact", "Social"]}
        onChange={(value) => {
          console.log(value); // string
          setShowSelected(value);
        }}
      />
      {showSelected === "Contact" ? <Contact /> : <Social />}
    </div>
  );
}

export default ContactSegment;
