// React 19 removed these props from HTMLAttributes. Material Tailwind v2 was
// compiled against React 18 types that still included them, so they appear as
// required missing props when using MT components. So these optional shims
// remove the false-positive errors until MT ships React 19 compatible types.
import type { PointerEventHandler, ReactEventHandler } from "react";

declare module "react" {
  interface HTMLAttributes<T> {
    placeholder?: string;
    onResize?: ReactEventHandler<T>;
    onResizeCapture?: ReactEventHandler<T>;
    onPointerEnterCapture?: PointerEventHandler<T>;
    onPointerLeaveCapture?: PointerEventHandler<T>;
  }
}
