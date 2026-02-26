"use client";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { ClipLoader } from "react-spinners";
import {
  Upload,
  Image as ImageIcon,
  Plus,
  X,
  Save,
  Eye,
  Tag as TagIcon,
  Folder,
  User,
  FileText,
  Link as LinkIcon,
  Search,
} from "lucide-react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { toast } from "react-hot-toast";
import { db, storage } from "@/firebase";
import { MyContext } from "@/context/MyContext";

// Reusable Input Component
const FormInput = ({ label, required, children, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="block text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

// Reusable Dialog Component
const Dialog = ({ open, onClose, title, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Image Upload Component
const ImageUpload = ({ preview, onUpload, label, type }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-700">
      {label} <span className="text-red-500">*</span>
    </label>
    <div
      onClick={onUpload}
      className="relative group cursor-pointer border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 transition-all duration-200 overflow-hidden"
    >
      {preview ? (
        <div className="relative aspect-video">
          <img src={preview} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="text-white text-center">
              <Upload className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">Change Image</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="aspect-video flex flex-col items-center justify-center text-gray-400 hover:text-purple-500 transition-colors">
          <ImageIcon className="h-12 w-12 mb-3" />
          <p className="font-medium">Click to upload {type}</p>
          <p className="text-sm">PNG, JPG up to 5MB</p>
        </div>
      )}
    </div>
  </div>
);

// Keyword Chip Component
const KeywordChip = ({ keyword, onDelete }) => (
  <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
    {keyword}
    <button
      onClick={() => onDelete(keyword)}
      className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
    >
      <X className="h-3 w-3" />
    </button>
  </span>
);

const CreateBlog = () => {
  const { mode, blog, setMode, fetchBlogs } = useContext(MyContext);

  // Form States
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    description: "",
    editorDescription: "",
    isFeatured: "",
    isCaseStudy: false,
    category: "",
    author: "",
  });

  const [seoData, setSeoData] = useState({
    title: "",
    description: "",
    keywords: [],
  });

  const [images, setImages] = useState({
    main: null,
    mainPreview: "",
    seo: null,
    seoPreview: "",
  });

  const [selectedTags, setSelectedTags] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Data States
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [archive, setArchive] = useState([]);

  // Dialog States
  const [dialogs, setDialogs] = useState({
    image: false,
    category: false,
    tag: false,
    author: false,
  });

  const [archiveOrUpload, setArchiveOrUpload] = useState("upload");
  const [imageType, setImageType] = useState("");

  // New Entity States
  const [newEntity, setNewEntity] = useState({
    name: "",
    slug: "",
    description: "",
  });

  // Utility Functions
  const generateSlug = (text) => text.toLowerCase().replace(/\s+/g, "-");
  const generateId = () => Math.floor(100000 + Math.random() * 900000).toString();

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesSnap, tagsSnap, authorsSnap, archiveSnap] = await Promise.all([
          getDocs(collection(db, "categories")),
          getDocs(collection(db, "tags")),
          getDocs(collection(db, "authors")),
          getDocs(collection(db, "archive")),
        ]);

        setCategories(categoriesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setTags(tagsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setAuthors(authorsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setArchive(archiveSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      }
    };
    fetchData();
  }, []);

  // Prefill for Edit Mode
  useEffect(() => {
    if (mode === "edit" && blog) {
      setFormData({
        title: blog.title || "",
        slug: blog.slug || "",
        summary: blog.summary || "",
        description: blog.description || "",
        editorDescription: blog.editorDescription || "",
        isFeatured: blog.isFeatured || "",
        isCaseStudy: blog.isCaseStudy || false,
        category: blog.category || "",
        author: blog.seo?.seoauthor || "",
      });
      setSeoData({
        title: blog.seo?.title || "",
        description: blog.seo?.description || "",
        keywords: blog.seo?.keywords || [],
      });
      setImages({
        ...images,
        mainPreview: blog.image || "",
        seoPreview: blog.seo?.image || "",
      });
      setSelectedTags(blog.tags || []);
    }
  }, [mode, blog]);

  // Auto-generate slugs
  useEffect(() => {
    if (formData.title && mode !== "edit") {
      setFormData((prev) => ({ ...prev, slug: generateSlug(prev.title) }));
    }
  }, [formData.title]);

  useEffect(() => {
    setNewEntity((prev) => ({ ...prev, slug: generateSlug(prev.name) }));
  }, [newEntity.name]);

  // Handlers
  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateSeoData = (field, value) => {
    setSeoData((prev) => ({ ...prev, [field]: value }));
  };

  const openDialog = (type) => {
    setImageType(type);
    setDialogs((prev) => ({ ...prev, image: true }));
    setArchiveOrUpload("upload");
  };

  const closeDialog = (type) => {
    setDialogs((prev) => ({ ...prev, [type]: false }));
    if (type === "image") setArchiveOrUpload("upload");
  };

  const handleImageUpload = useCallback(async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }, []);

  const handleAddKeyword = (e) => {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault();
      setSeoData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()],
      }));
      setKeywordInput("");
    }
  };

  const handleAddEntity = async (type) => {
    if (!newEntity.name.trim()) return;

    try {
      const collectionName = `${type}s`;
      const docRef = await addDoc(collection(db, collectionName), {
        name: newEntity.name,
        slug: newEntity.slug,
        description: newEntity.description,
        createdAt: serverTimestamp(),
      });

      const newItem = {
        id: docRef.id,
        name: newEntity.name,
        slug: newEntity.slug,
        description: newEntity.description,
      };

      if (type === "category") setCategories((prev) => [...prev, newItem]);
      else if (type === "tag") setTags((prev) => [...prev, newItem]);
      else if (type === "author") setAuthors((prev) => [...prev, newItem]);

      setNewEntity({ name: "", slug: "", description: "" });
      closeDialog(type);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} added successfully!`);
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
      toast.error(`Failed to add ${type}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const required = [
      "title",
      "slug",
      "description",
      "editorDescription",
      "isFeatured",
      "summary",
      "category",
      "author",
    ];
    const missing = required.filter((field) => !formData[field] && field !== "author" ? !seoData.title : !formData[field]);

    if (missing.length || !selectedTags.length || !seoData.keywords.length) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      let mainImageURL = images.mainPreview;
      let seoImageURL = images.seoPreview;

      if (images.main) {
        mainImageURL = await handleImageUpload(
          images.main,
          `/adminPanel/blogs/${formData.slug}/images/${images.main.name}`
        );
        await handleImageUpload(images.main, `/adminPanel/archive/images/${images.main.name}`);
        await addDoc(collection(db, "archive"), { ImageUrl: mainImageURL });
      }

      if (images.seo) {
        seoImageURL = await handleImageUpload(
          images.seo,
          `/adminPanel/blogs/${formData.slug}/seoImages/${images.seo.name}`
        );
        await handleImageUpload(images.seo, `/adminPanel/archive/images/${images.seo.name}`);
        await addDoc(collection(db, "archive"), { ImageUrl: seoImageURL });
      }

      const blogData = {
        ...formData,
        image: mainImageURL,
        tags: selectedTags,
        seo: {
          ...seoData,
          image: seoImageURL,
          seoauthor: formData.author,
        },
        createdAt: serverTimestamp(),
      };

      if (mode === "edit") {
        await updateDoc(doc(db, "blogs", blog.id), blogData);
        toast.success("Blog updated successfully!");
      } else {
        await setDoc(doc(db, "blogs", generateId()), blogData);
        toast.success("Blog created successfully!");
      }

      fetchBlogs();
      resetForm();
      setMode("create");
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error("Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      summary: "",
      description: "",
      editorDescription: "",
      isFeatured: "",
      isCaseStudy: false,
      category: "",
      author: "",
    });
    setSeoData({ title: "", description: "", keywords: [] });
    setImages({ main: null, mainPreview: "", seo: null, seoPreview: "" });
    setSelectedTags([]);
    setKeywordInput("");
  };

  return (
    <div className="max-w-7xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormInput label="Title" required>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateFormData("title", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter blog title..."
              />
            </FormInput>

            <FormInput label="Slug" required>
              <div className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => updateFormData("slug", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="auto-generated-slug"
                />
              </div>
            </FormInput>

            <FormInput label="Description" required className="lg:col-span-2">
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                placeholder="Brief description..."
              />
            </FormInput>

            <FormInput label="Summary" required className="lg:col-span-2">
              <textarea
                value={formData.summary}
                onChange={(e) => updateFormData("summary", e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                placeholder="Summary for preview..."
              />
            </FormInput>

            <FormInput label="Case Study" required>
              <select
                value={formData.isCaseStudy}
                onChange={(e) => updateFormData("isCaseStudy", e.target.value === "true")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">Select...</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </FormInput>

            <FormInput label="Featured" required>
              <select
                value={formData.isFeatured}
                onChange={(e) => updateFormData("isFeatured", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </FormInput>
          </div>
        </div>

        {/* Images Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <ImageIcon className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">Images</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ImageUpload
              preview={images.mainPreview}
              onUpload={() => openDialog("main")}
              label="Featured Image"
              type="featured image"
            />
            <ImageUpload
              preview={images.seoPreview}
              onUpload={() => openDialog("seo")}
              label="SEO Image"
              type="SEO image"
            />
          </div>
        </div>

        {/* Editor Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">Content</h2>
          </div>

          <Editor
            apiKey="8chcwwvcqzr5y265clc5bk499fw0iepipwpm9gsusxmzqt03"
            value={formData.editorDescription}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent | fontsizeselect | forecolor backcolor | link image media | fullscreen",
            }}
            onEditorChange={(content) => updateFormData("editorDescription", content)}
          />
        </div>

        {/* Category & Tags Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <Folder className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">Organization</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormInput label="Category" required>
              <div className="flex gap-2">
                <select
                  value={formData.category}
                  onChange={(e) => updateFormData("category", e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="">Select category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setDialogs((prev) => ({ ...prev, category: true }))}
                  className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </FormInput>

            <FormInput label="Tags" required>
              <div className="flex gap-2">
                <select
                  multiple
                  value={selectedTags}
                  onChange={(e) => setSelectedTags(Array.from(e.target.selectedOptions, (opt) => opt.value))}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  {tags.map((tag) => (
                    <option key={tag.id} value={tag.name}>
                      {tag.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setDialogs((prev) => ({ ...prev, tag: true }))}
                  className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </FormInput>

            {selectedTags.length > 0 && (
              <div className="lg:col-span-2 flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <KeywordChip
                    key={tag}
                    keyword={tag}
                    onDelete={(t) => setSelectedTags(selectedTags.filter((tag) => tag !== t))}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SEO Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <Search className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">SEO Settings</h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormInput label="SEO Title" required>
                <input
                  type="text"
                  value={seoData.title}
                  onChange={(e) => updateSeoData("title", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="SEO optimized title..."
                />
              </FormInput>

              <FormInput label="Author" required>
                <div className="flex gap-2">
                  <select
                    value={formData.author}
                    onChange={(e) => updateFormData("author", e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select author...</option>
                    {authors.map((auth) => (
                      <option key={auth.id} value={auth.name}>
                        {auth.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setDialogs((prev) => ({ ...prev, author: true }))}
                    className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </FormInput>
            </div>

            <FormInput label="SEO Description" required>
              <textarea
                value={seoData.description}
                onChange={(e) => updateSeoData("description", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                placeholder="Meta description for search engines..."
              />
            </FormInput>

            <FormInput label="SEO Keywords" required>
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={handleAddKeyword}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Type keyword and press Enter..."
              />
            </FormInput>

            {seoData.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {seoData.keywords.map((keyword) => (
                  <KeywordChip
                    key={keyword}
                    keyword={keyword}
                    onDelete={(kw) =>
                      updateSeoData(
                        "keywords",
                        seoData.keywords.filter((k) => k !== kw)
                      )
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={resetForm}
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <ClipLoader size={20} color="white" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                {mode === "edit" ? "Update Blog" : "Create Blog"}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Image Upload Dialog */}
      <Dialog
        open={dialogs.image}
        onClose={() => closeDialog("image")}
        title="Upload Image"
      >
        <div className="space-y-4">
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setArchiveOrUpload("upload")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${archiveOrUpload === "upload"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              Upload New
            </button>
            <button
              onClick={() => setArchiveOrUpload("archive")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${archiveOrUpload === "archive"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              From Archive
            </button>
          </div>

          {archiveOrUpload === "upload" ? (
            <label className="block">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-purple-500 transition-all">
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 font-medium mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-400">PNG, JPG up to 5MB</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (imageType === "main") {
                        setImages({
                          ...images,
                          main: file,
                          mainPreview: URL.createObjectURL(file),
                        });
                      } else {
                        setImages({
                          ...images,
                          seo: file,
                          seoPreview: URL.createObjectURL(file),
                        });
                      }
                      closeDialog("image");
                    }
                  }}
                />
              </div>
            </label>
          ) : (
            <div className="grid grid-cols-3 gap-4 max-h-96 overflow-auto">
              <label className="block">
                <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-500 transition-all">
                  <Plus className="h-8 w-8 text-gray-400" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        try {
                          const url = await handleImageUpload(file, `/adminPanel/archive/images/${file.name}`);
                          await addDoc(collection(db, "archive"), { ImageUrl: url });
                          setArchive([...archive, { ImageUrl: url }]);
                          toast.success("Image added to archive");
                        } catch (error) {
                          toast.error("Failed to upload image");
                        }
                      }
                    }}
                  />
                </div>
              </label>
              {archive.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (imageType === "main") {
                      setImages({ ...images, mainPreview: item.ImageUrl });
                    } else {
                      setImages({ ...images, seoPreview: item.ImageUrl });
                    }
                    closeDialog("image");
                  }}
                  className="aspect-square border-2 border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-purple-500 transition-all"
                >
                  <img src={item.ImageUrl} alt="Archive" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog
        open={dialogs.category}
        onClose={() => closeDialog("category")}
        title="Add New Category"
      >
        <div className="space-y-4">
          <FormInput label="Category Name" required>
            <input
              type="text"
              value={newEntity.name}
              onChange={(e) => setNewEntity({ ...newEntity, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter category name..."
            />
          </FormInput>
          <FormInput label="Slug">
            <input
              type="text"
              value={newEntity.slug}
              onChange={(e) => setNewEntity({ ...newEntity, slug: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="auto-generated-slug"
            />
          </FormInput>
          <FormInput label="Description">
            <textarea
              value={newEntity.description}
              onChange={(e) => setNewEntity({ ...newEntity, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              placeholder="Optional description..."
            />
          </FormInput>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => closeDialog("category")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleAddEntity("category")}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add Category
            </button>
          </div>
        </div>
      </Dialog>

      {/* Add Tag Dialog */}
      <Dialog
        open={dialogs.tag}
        onClose={() => closeDialog("tag")}
        title="Add New Tag"
      >
        <div className="space-y-4">
          <FormInput label="Tag Name" required>
            <input
              type="text"
              value={newEntity.name}
              onChange={(e) => setNewEntity({ ...newEntity, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter tag name..."
            />
          </FormInput>
          <FormInput label="Slug">
            <input
              type="text"
              value={newEntity.slug}
              onChange={(e) => setNewEntity({ ...newEntity, slug: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="auto-generated-slug"
            />
          </FormInput>
          <FormInput label="Description">
            <textarea
              value={newEntity.description}
              onChange={(e) => setNewEntity({ ...newEntity, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              placeholder="Optional description..."
            />
          </FormInput>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => closeDialog("tag")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleAddEntity("tag")}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add Tag
            </button>
          </div>
        </div>
      </Dialog>

      {/* Add Author Dialog */}
      <Dialog
        open={dialogs.author}
        onClose={() => closeDialog("author")}
        title="Add New Author"
      >
        <div className="space-y-4">
          <FormInput label="Author Name" required>
            <input
              type="text"
              value={newEntity.name}
              onChange={(e) => setNewEntity({ ...newEntity, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter author name..."
            />
          </FormInput>
          <FormInput label="Slug">
            <input
              type="text"
              value={newEntity.slug}
              onChange={(e) => setNewEntity({ ...newEntity, slug: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="auto-generated-slug"
            />
          </FormInput>
          <FormInput label="Bio">
            <textarea
              value={newEntity.description}
              onChange={(e) => setNewEntity({ ...newEntity, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              placeholder="Author bio..."
            />
          </FormInput>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => closeDialog("author")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleAddEntity("author")}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add Author
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default CreateBlog;