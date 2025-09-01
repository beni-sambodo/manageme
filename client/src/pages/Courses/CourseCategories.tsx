// import { useState } from "react";
// import { Button, Skeleton, Modal, Input, message } from "antd";
// import courseService from "../../services/course.service";
// import { useApiGet } from "../../services/queryConfig";
// import { ICourseC } from "../../Types/Types";
// import { FaTrash } from "react-icons/fa";
// import { FaPenToSquare } from "react-icons/fa6";

// // Add Category Modal Component
// function AddCategoryModal({
//   loading,
//   isOpen,
//   onSubmit,
//   onCancel,
//   categoryName,
//   onCategoryNameChange,
// }: any) {
//   return (
//     <Modal
//       title="Add New Category"
//       open={isOpen}
//       onOk={onSubmit}
//       onCancel={onCancel}
//       confirmLoading={loading}
//     >
//       <Input
//         placeholder="Category Name"
//         value={categoryName}
//         onChange={(e) => onCategoryNameChange(e.target.value)}
//       />
//     </Modal>
//   );
// }

// // Edit Category Modal Component
// function EditCategoryModal({
//   loading,
//   isOpen,
//   onSubmit,
//   onCancel,
//   currentCategory,
//   onCategoryNameChange,
// }: any) {
//   return (
//     <Modal
//       title="Edit Category"
//       open={isOpen}
//       onOk={onSubmit}
//       onCancel={onCancel}
//       confirmLoading={loading}
//     >
//       <Input
//         placeholder="Category Name"
//         defaultValue={currentCategory?.name || ""}
//         onChange={(e) => onCategoryNameChange(e.target.value)}
//       />
//     </Modal>
//   );
// }

// // Delete Category Modal Component
// function DeleteCategoryModal({ loading, isOpen, onSubmit, onCancel }: any) {
//   return (
//     <Modal
//       title="Delete Category"
//       open={isOpen}
//       onOk={onSubmit}
//       onCancel={onCancel}
//       confirmLoading={loading}
//     >
//       <p>Are you sure you want to delete this category?</p>
//     </Modal>
//   );
// }

// export default function CourseCategories() {
//   const { isLoading, data, refetch } = useApiGet(["getCourseCategories"], () =>
//     courseService.getCourseCategories()
//   );

//   const create = (name: string) => courseService.createCourseCategory(name);
//   const update = (id: string, name: string) =>
//     courseService.updateCourseCategory(id, name);
//   const deleteCategory = (id: string) => courseService.deleteCourseCategory(id);

//   const [loading, setLoading] = useState<boolean>(false);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [currentCategory, setCurrentCategory] = useState<ICourseC | null>(null);
//   const [newCategoryName, setNewCategoryName] = useState("");

//   const handleCategoryNameChange = (value: string) => {
//     setNewCategoryName(value);
//   };

//   const handleAdd = () => {
//     setIsAddModalOpen(true);
//   };

//   const handleEdit = (category: ICourseC) => {
//     setCurrentCategory(category);
//     setIsEditModalOpen(true);
//   };

//   const handleDelete = (category) => {
//     setCurrentCategory(category);
//     setIsDeleteModalOpen(true);
//   };

//   const handleAddSubmit = async () => {
//     if (newCategoryName.trim() === "") {
//       message.error("Category name cannot be empty.");
//       return;
//     }

//     try {
//       setLoading(true);
//       await create(newCategoryName);
//       message.success("Category added successfully!");
//       setIsAddModalOpen(false);
//       setNewCategoryName("");
//       refetch();
//     } catch (error) {
//       setLoading(false);
//       message.error("Failed to add category. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditSubmit = async () => {
//     if (newCategoryName.trim() === "") {
//       message.error("Category name cannot be empty.");
//       return;
//     }

//     if (currentCategory) {
//       try {
//         setLoading(true);
//         await update(currentCategory._id, newCategoryName);
//         message.success("Category updated successfully!");
//         setIsEditModalOpen(false);
//         setNewCategoryName("");
//         setCurrentCategory(null);
//         refetch();
//       } catch (error) {
//         setLoading(false);
//         message.error("Failed to update category. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleDeleteSubmit = async () => {
//     if (currentCategory) {
//       try {
//         setLoading(true);
//         await deleteCategory(currentCategory._id);
//         message.success("Category deleted successfully!");
//         setIsDeleteModalOpen(false);
//         setCurrentCategory(null);
//         refetch();
//       } catch (error) {
//         setLoading(false);
//         message.error("Failed to delete category. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   return (
//     <div  className=" rounded-lg">
//       <div className="flex items-center gap-5 justify-between">
//         <h1 className="text-lg font-semibold">Course Categories</h1>
//         <Button onClick={handleAdd}>Add New</Button>
//       </div>

//       {/* <div className="py-4">
//         {isLoading ? (
//           <div className="px-4 ">
//             <Skeleton title />
//           </div>
//         ) : (
//           data?.map((c: ICourseC) => (
//             <div
//               key={c._id}
//               className="flex justify-between py-3 hover:bg-black/5 duration-200 px-4 items-center text-lg"
//             >
//               <p> {c.name}</p>
//               <div className="flex">
//                 <Button
//                   type="text"
//                   className="text-lg"
//                   onClick={() => handleEdit(c)}
//                 >
//                   <FaPenToSquare />
//                 </Button>
//                 <Button type="text" danger onClick={() => handleDelete(c)}>
//                   <FaTrash />
//                 </Button>
//               </div>
//             </div>
//           ))
//         )}
//       </div> */}

//       <AddCategoryModal
//         loading={loading}
//         isOpen={isAddModalOpen}
//         onSubmit={handleAddSubmit}
//         onCancel={() => setIsAddModalOpen(false)}
//         categoryName={newCategoryName}
//         onCategoryNameChange={handleCategoryNameChange}
//       />

//       <EditCategoryModal
//         loading={loading}
//         isOpen={isEditModalOpen}
//         onSubmit={handleEditSubmit}
//         onCancel={() => {
//           setIsEditModalOpen(false);
//           setCurrentCategory(null);
//         }}
//         currentCategory={currentCategory}
//         onCategoryNameChange={handleCategoryNameChange}
//       />

//       <DeleteCategoryModal
//         loading={loading}
//         isOpen={isDeleteModalOpen}
//         onSubmit={handleDeleteSubmit}
//         onCancel={() => setIsDeleteModalOpen(false)}
//         currentCategory={currentCategory}
//       />
//     </div>
//   );
// }
