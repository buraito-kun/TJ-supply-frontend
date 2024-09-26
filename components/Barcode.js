import JsBarcode from "jsbarcode";

import { useEffect, useRef } from "react";

export default function Barcode({ value }) {
  const componentRef = useRef();

  useEffect(() => {
    if (componentRef.current)
      JsBarcode(componentRef.current, value, {
        width: 1,
        height: 20,
        margin: 4,
        displayValue: false,
      });
  }, [value]);

  return <canvas ref={componentRef}></canvas>;
}
