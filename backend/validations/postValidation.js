import * as Yup from 'yup';
export const postSchema = Yup.object().shape({
    content: Yup.string().min(6).required(),
    description: Yup.string().min(6).required(),
    image: Yup.array().required(),
})