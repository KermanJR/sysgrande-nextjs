import { AuthProvider } from "@/app/context/AuthContext";
import "./globals.css";
import Theme from "@/app/theme/theme";
import { CartProvider } from "@/app/context/CartContext";
import { SnackbarProvider } from "notistack";

export default function MyApp({ Component, pageProps }) {
  return (
    <SnackbarProvider maxSnack={3} >
    <CartProvider>
    <AuthProvider>
      <Theme>
        <Component {...pageProps} />
      </Theme>
    </AuthProvider>
    </CartProvider>
    </SnackbarProvider>
  );
}
