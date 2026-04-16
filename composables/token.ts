export const useToken = () =>
  useState("token", () =>
    useCookie("rm_token", {
      maxAge: 99999999,
    })
  );

export const useWishlistCount = () => useState('wishlistCount', () => 0)