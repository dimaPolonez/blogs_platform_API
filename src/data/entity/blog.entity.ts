import mongoose, { Model, Schema } from "mongoose";
import { blogBDType } from "../../models/blog.models";

export const blogBDSchema =  new Schema<blogBDType>({
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String
})

export const BlogModel = mongoose.model('blogs', blogBDSchema)




