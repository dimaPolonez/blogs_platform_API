import {postsFieldsType} from "../models/data.models";


export let POSTS: postsFieldsType [] = [
    {
        id: "1",
        title: "111 Top 10 Technology Blogs for Latest Tech Updates, News & Information!",
        shortDescription: "111 Looking for tech blogs to keep up with the latest technology trends? " +
            "No worries! Your search ends here! Read on…People from different walks of life are intrigued " +
            "by the way technology is progressing at a profuse rate, shaping our lives into the digital world!" +
            "With new tech trends being introduced every quarter and information becoming obsolete as technology " +
            "evolves, it’s now an obligation to stay relevant and learn about the newest technologies, digital " +
            "industry, social media, and the web in general!",
        content: "111 Looking for tech blogs to keep up with the latest technology trends? " +
            "No worries! Your search ends here! Read on…" +
            "People from different walks of life are intrigued by the way technology is progressing at a " +
            "profuse rate, shaping our lives into the digital world! With new tech trends being introduced " +
            "every quarter and information becoming obsolete as technology evolves, it’s now an obligation to stay " +
            "relevant and learn about the newest technologies, digital industry, social media, " +
            "and the web in general! The question is how? Well, millions of tech enthusiasts, as well as businesses " +
            "from all sectors, befriend technology blogs that bring the latest news regarding technology updates " +
            "faster than any other source. These technology blogs not only embrace high-tech discoveries but also " +
            "help readers in staying consistently ahead of the curve by determining modern-day tech trends!" +
            "Therefore, we have rounded up a list of the 10 best technology blogs, that would bring you the latest " +
            "information from across the world. Following these latest technology blogs will give you a steady " +
            "stream of great ideas regarding technology. Whether it’s the news or information about the latest " +
            "gadgets in the market, these blogs will bring you everything from the modern tech world! Let’s dig in!",
        blogId: "1",
        blogName: "Blogger1"
    },
    {
        id: "2",
        title: "222 Top 10 Technology Blogs for Latest Tech Updates, News & Information!",
        shortDescription: "222 Looking for tech blogs to keep up with the latest technology trends? " +
            "No worries! Your search ends here! Read on…People from different walks of life are intrigued " +
            "by the way technology is progressing at a profuse rate, shaping our lives into the digital world!" +
            "With new tech trends being introduced every quarter and information becoming obsolete as technology " +
            "evolves, it’s now an obligation to stay relevant and learn about the newest technologies, digital " +
            "industry, social media, and the web in general!",
        content: "222 Looking for tech blogs to keep up with the latest technology trends? " +
            "No worries! Your search ends here! Read on…" +
            "People from different walks of life are intrigued by the way technology is progressing at a " +
            "profuse rate, shaping our lives into the digital world! With new tech trends being introduced " +
            "every quarter and information becoming obsolete as technology evolves, it’s now an obligation to stay " +
            "relevant and learn about the newest technologies, digital industry, social media, " +
            "and the web in general! The question is how? Well, millions of tech enthusiasts, as well as businesses " +
            "from all sectors, befriend technology blogs that bring the latest news regarding technology updates " +
            "faster than any other source. These technology blogs not only embrace high-tech discoveries but also " +
            "help readers in staying consistently ahead of the curve by determining modern-day tech trends!" +
            "Therefore, we have rounded up a list of the 10 best technology blogs, that would bring you the latest " +
            "information from across the world. Following these latest technology blogs will give you a steady " +
            "stream of great ideas regarding technology. Whether it’s the news or information about the latest " +
            "gadgets in the market, these blogs will bring you everything from the modern tech world! Let’s dig in!",
        blogId: "2",
        blogName: "Blogger2"
    },
    {
        id: "3",
        title: "333 Top 10 Technology Blogs for Latest Tech Updates, News & Information!",
        shortDescription: "111 Looking for tech blogs to keep up with the latest technology trends? " +
            "No worries! Your search ends here! Read on…People from different walks of life are intrigued " +
            "by the way technology is progressing at a profuse rate, shaping our lives into the digital world!" +
            "With new tech trends being introduced every quarter and information becoming obsolete as technology " +
            "evolves, it’s now an obligation to stay relevant and learn about the newest technologies, digital " +
            "industry, social media, and the web in general!",
        content: "333 Looking for tech blogs to keep up with the latest technology trends? " +
            "No worries! Your search ends here! Read on…" +
            "People from different walks of life are intrigued by the way technology is progressing at a " +
            "profuse rate, shaping our lives into the digital world! With new tech trends being introduced " +
            "every quarter and information becoming obsolete as technology evolves, it’s now an obligation to stay " +
            "relevant and learn about the newest technologies, digital industry, social media, " +
            "and the web in general! The question is how? Well, millions of tech enthusiasts, as well as businesses " +
            "from all sectors, befriend technology blogs that bring the latest news regarding technology updates " +
            "faster than any other source. These technology blogs not only embrace high-tech discoveries but also " +
            "help readers in staying consistently ahead of the curve by determining modern-day tech trends!" +
            "Therefore, we have rounded up a list of the 10 best technology blogs, that would bring you the latest " +
            "information from across the world. Following these latest technology blogs will give you a steady " +
            "stream of great ideas regarding technology. Whether it’s the news or information about the latest " +
            "gadgets in the market, these blogs will bring you everything from the modern tech world! Let’s dig in!",
        blogId: "3",
        blogName: "Blogger3"
    }
]


export function postsDeleteById(bodyId: string) {

    POSTS = POSTS.filter(fields => fields.id !== bodyId)

}

