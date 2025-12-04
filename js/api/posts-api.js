//import api from "./axios.js";

function getPosts() {
    return response //api.get("/posts");
}


function createPost(postData) {
    const newpost = {
        data: {
            id: response.data.length + 1,
            title: postData.title,
            content: postData.content,
            category: postData.category,
            createdAt: new Date().toISOString(),
            author: {
                name: "Գայանե Սարգսյան",
                avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg"
            },
            comments: []
        }
    }

    return newpost//api.post("/posts", postData);
}
function createComment(postId, commentData) {
    const newComment = {
        data: {
            id: response.data.length + 1,
            text: commentData.text,
            createdAt: new Date().toISOString(),
            author: {
                name: "Գայանե Սարգսյան",
                avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg"
            }
        }
    }

    return newComment//api.post(`/posts/${postId}/comments`, commentData);
}

const response = {
    data: [
        {
            id: 1,
            title: "Աշխատանքային հնարավորություն",
            content: `
              Հարգելի շրջանավարտներ, “Armenian Tech Solutions” ընկերությունը փնտրում է
              <b>Junior Frontend Developer</b>՝ React և JavaScript գիտելիքներով:
              Բոլոր հետաքրքրված շրջանավարտները կարող են ուղարկել CV ամբիոնի էլ. հասցեին՝ <a
                href="mailto:programming@polytech.am">programming@polytech.am</a>։
            `,
            category: "job",
            createdAt: "2025-10-26T11:20:00Z",
            author: {
                name: "Ծրագրավորման ամբիոն",
                avatar: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100&h=100"
            },
            comments: [
                {
                    text: "Շատ հետաքրքիր է, ինչ ժամկետում կարելի է դիմել՞",
                    author: {
                        name: "Շրջանավարտ Անի Կարապետյան",
                        avatar: "https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=50&h=50"
                    },
                    createdAt: "2025-10-26T11:45:00Z"
                },
                {
                    text: "Դիմել կարելի է մինչև նոյեմբերի 5-ը։",
                    author: {
                        name: "Դասախոս Նարե Հովհաննիսյան",
                        avatar: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=50&h=50"
                    },
                    createdAt: "2025-10-26T12:00:00Z"
                }
            ]
        },

        {
            id: 2,
            title: "Աշխատանքային առաջարկ՝ ինժեներների համար",
            content: `<p>
              “Synopsys Armenia” ընկերությունը հայտարարում է մրցույթ <b>Hardware Engineer Intern</b> պաշտոնի համար։
              Դիմել կարող են Պոլիտեխնիկի Էլեկտրոնիկայի բաժնի շրջանավարտները։
            </p>`,
            category: "internship",
            createdAt: "2025-10-25T09:00:00Z",
            author: {
                name: "Էլեկտրոնիկայի ամբիոն",
                avatar: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=100&h=100"
            },
            comments: [
                {
                    text: "Կարելի՞ է դիմել առանց նախնական փորձի։",
                    author: {
                        name: "Շրջանավարտ Դավիթ Ավագյան",
                        avatar: "https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=50&h=50"
                    },
                    createdAt: "2025-10-25T09:30:00Z"
                },
                {
                    text: "Այո, սա ուսուցողական ծրագիր է, փորձը պարտադիր չէ։",
                    author: {
                        name: "Դասախոս Անի Սարգսյան",
                        avatar: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=50&h=50"
                    },
                    createdAt: "2025-10-25T09:50:00Z"
                }
            ]
        },

        {
            id: 3,
            title: "Data Analyst Internship",
            content: `<p>
              “Ameriabank” առաջարկում է պրակտիկա տվյալների վերլուծության ոլորտում։
              Հիմնական պահանջներ՝ Python, SQL և Excel-ի հիմունքներ։
              Լավագույն մասնակիցներին կառաջարկվի մշտական աշխատանք։
            </p>`,
            category: "training",
            createdAt: "2025-10-24T15:00:00Z",
            author: {
                name: "Տվյալների գիտության ամբիոն",
                avatar: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100&h=100"
            },
            comments: [
                {
                    text: "Կապը ինչպես հաստատենք բանկի HR-ի հետ՞",
                    author: {
                        name: "Շրջանավարտ Նարեկ Մաթևոսյան",
                        avatar: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=50&h=50"
                    },
                    createdAt: "2025-10-24T15:30:00Z"
                },
                {
                    text: "HR-ի կոնտակտները կտեղադրենք ամբիոնի կայքում։",
                    author: {
                        name: "Դասախոս Կարեն Մարկոսյան",
                        avatar: "https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=50&h=50"
                    },
                    createdAt: "2025-10-24T15:45:00Z"
                }
            ]
        }
    ]
};