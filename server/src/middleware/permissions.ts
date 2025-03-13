// import { Request, Response, NextFunction } from "express";

// /**
//  * Middleware to check if the user has the required permission.
//  * @param requiredPermission The permission that is required to access the route.
//  */
// export const checkPermission = (requiredPermission: string) => {
//   return (req: Request, res: Response, next: NextFunction): void => {
//     try {
//       if (!req.user) {
//         res.status(401).json({ message: "Unauthorized: No user found in request." });
//         return;
//       }

//       if (!req.user.permissions || !req.user.permissions.includes(requiredPermission)) {
//         res.status(403).json({ message: "Forbidden: You do not have the required permissions." });
//         return;
//       }

//       next(); // Proceed to the next middleware/controller
//     } catch (error) {
//       console.error("Error in checkPermission middleware:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   };
// };
