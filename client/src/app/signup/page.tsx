// "use client"; // Ensure this is a Client Component

// import { useState } from "react";
// import { useRegisterUserMutation } from "@/state/api";
// import { useRouter } from "next/navigation";

// const Register = () => {
//   const [registerUser, { isLoading, error }] = useRegisterUserMutation();
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     password: "",
//     role: "",
//     phone_number: "",
//     organizationName: "",
//     username: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log(formData)
//     try {
//         const registerData = { 
//             first_name: formData.first_name, 
//             last_name: formData.last_name, 
//             email: formData.email, 
//             phone_number: formData.phone_number, 
//             username: formData.email, 
//             password: formData.password, 
//             role: formData.role 
//         };
//       await registerUser(registerData).unwrap();
//       router.push("/login"); // Redirect after successful registration
//     } catch (err) {
//       console.error("Registration failed", err);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg w-96">
//         <h2 className="text-2xl font-semibold mb-4">Register</h2>

//         {error && <p className="text-red-500">{(error as any).data?.message || "Registration failed"}</p>}
//         {/* {
//   "first_name": "John",
//   "last_name": "Doe",
//   "email": "johndoe@example.com",
//   "phone_number": "1234567890",
//   "username": "johndoe",
//   "password": "SecurePassword123",
//   "role": "USER"
// } */}
//         <input
//           type="text"
//           name="first_name"
//           placeholder="First Name"
//           value={formData.first_name}
//           onChange={handleChange}
//           className="w-full p-2 mb-4 border rounded"
//           required
//         />

//         <input
//           type="text"
//           name="last_name"
//           placeholder="Last Name"
//           value={formData.last_name}
//           onChange={handleChange}
//           className="w-full p-2 mb-4 border rounded"
//           required
//         />

//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           className="w-full p-2 mb-4 border rounded"
//           required
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           className="w-full p-2 mb-4 border rounded"
//           required
//         />

//         <select
//           name="role"
//           value={formData.role}
//           onChange={handleChange}
//           className="w-full p-2 mb-4 border rounded"
//         >
//           <option value="">Select Role</option>
//           <option value="ADMIN">Admin</option>
//           <option value="USER">User</option>
//         </select>

//         <input
//           type="text"
//           name="phone_number"
//           placeholder="Contact Phone"
//           value={formData.phone_number}
//           onChange={handleChange}
//           className="w-full p-2 mb-4 border rounded"
//         />

//         <input
//           type="text"
//           name="username"
//           placeholder="User Name"
//           value={formData.username}
//           onChange={handleChange}
//           className="w-full p-2 mb-4 border rounded"
//         />

//         <input
//           type="text"
//           name="organizationName"
//           placeholder="Organization Name"
//           value={formData.organizationName}
//           onChange={handleChange}
//           className="w-full p-2 mb-4 border rounded"
//         />

//         {/* <input
//           type="text"
//           name="taxId"
//           placeholder="Tax ID"
//           value={formData.taxId}
//           onChange={handleChange}
//           className="w-full p-2 mb-4 border rounded"
//         /> */}

//         <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded" disabled={isLoading}>
//           {isLoading ? "Registering..." : "Register"}
//         </button>

//         <p className="mt-4 text-sm text-center">
//           Already have an account? <a href="/login" className="text-blue-500">Login</a>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Register;
