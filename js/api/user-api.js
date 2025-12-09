//import api from "./axios.js";
/**
 * Get user profile
 * @param {string} userId - User ID
 * @returns {Promise} - User profile data
 */
function getUserProfile() {
    const userId = localStorage.getItem('user_id');
    //search user by id
    console.log(userId);
    const user = userProfile.data.find(user => user.id === parseInt(userId));
    console.log(user);
    return user;//api.get(`/users/${id}`);
}

function getUserPosts(id) {
    return response//api.get(`/users/${id}/posts`);
}


/** ========
 * MOCK DATA
 * ======== */
const userProfile = {
    data: [
        {
            id: 5,
            avatar: "https://bravo.am/static/gallery/78391/5c5a78d1f94e297f251c61204a85830f.jpg",
            cover: "https://images.unsplash.com/photo-1503437313881-503a91226402?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            name: "Աննա Հարությունյան",
            jobTitle: "Վեբ ծրագրավորող",
            description: `Ես երիտասարդ մասնագետ եմ՝ հետաքրքրված ժամանակակից վեբ տեխնոլոգիաներով,
ծրագրային ճարտարապետությամբ և նորարարական լուծումների մշակմամբ։ Սիրում եմ
ուսումնասիրել նոր գործիքներ, փորձարկել գաղափարներ և ստեղծել կիրառական
նախագծեր, որոնք իրական խնդիրներ են լուծում։ Սա իմ անձնական էջն է, որտեղ կարող եք
ավելի շատ տեղեկություններ գտնել իմ փորձի և գործունեության մասին։`,

            education: [
                {
                    logo: "http://all4rd.polytechnic.am/Picts/politex.jpg",
                    institution: "Հայաստանի ազգային պոլիտեխնիկական համալսարան",
                    degree: "Բակալավր, Ծրագրային ճարտարագիտական համակարգեր",
                    startDate: "2021-9",
                    endDate: "2027-5"
                }
            ],

            licenses: [
                {
                    title: "Full-Stack Web Development",
                    issuer: "Armenian Code Academy",
                    date: "2024-4",
                    logo: null,
                    credential: ""
                },
                {
                    title: "Advanced Neural Networks and Deep Learning",
                    issuer: "DeepLearning.AI",
                    date: "2025-3",
                    logo: "http://coursera-university-assets.s3.amazonaws.com/b4/5cb90bb92f420b99bf323a0356f451/Icon.png",
                    credential: "link"
                }
            ]
        },

        // USER 2
        {
            id: 6,
            cover: "https://images.unsplash.com/photo-1552508744-1696d4464960?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            avatar: "https://yt3.googleusercontent.com/ytc/AIdro_lcnecdjw-T_ERo27p4821DI1EzgAMclMjM_QBrDUEVIT0=s160-c-k-c0x00ffffff-no-rj",
            name: "Գևորգ Սարգսյան",
            jobTitle: "Backend ծրագրավորող",
            description: `Ինձ հետաքրքրում են backend ճարտարապետությունները, մեծ տվյալների մշակումն ու
կատարողականության օպտիմիզացումը։ Աշխատում եմ Node.js–ով և PostgreSQL–ով, իսկ
ազատ ժամանակում ուսումնասիրում եմ cloud տեխնոլոգիաներ։`,

            education: [
                {
                    logo: "https://www.eduopinions.com/wp-content/uploads/2017/09/Yerevan-State-University-YSU-logo-350x250.png",
                    institution: "Երևանի պետական համալսարան",
                    degree: "Մագիստրոս, Ինֆորմատիկա",
                    startDate: "2020-9",
                    endDate: "2022-6"
                }
            ],

            licenses: [
                {
                    title: "Node.js Advanced Concepts",
                    issuer: "Udemy",
                    date: "2023-11",
                    logo: null,
                    credential: ""
                }
            ]
        },

        // USER 3
        {
            id: 7,
            cover: "https://images.unsplash.com/photo-1496096265110-f83ad7f96608?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            avatar: "https://hoonch.am/images/Hay/2024/Sat-Avagyan/Satenik-Avagyan-estest-mazaheracman-masnaget-diod.jpg",
            name: "Մարիա Ավագյան",
            jobTitle: "UI/UX դիզայներ",
            description: `Ես ստեղծում եմ պարզ, հարմար և ժամանակակից ինտերֆեյսներ։ Սիրում եմ
փորձարկել նոր դիզայն սթայլեր և աշխատել prototyping գործիքներով։ Իմ նպատակը
օգտատիրոջ համար հաճելի և արդյունավետ փորձ ստեղծելն է։`,

            education: [
                {
                    logo: "https://www.topuniversities.com/sites/default/files/profiles/logos/250515072612am291939m-logo-200x200.jpg",
                    institution: "Հայ-Ռուսական (Սլավոնական) Համալսարան",
                    degree: "Դիզայն, Բակալավր",
                    startDate: "2019-9",
                    endDate: "2023-6"
                }
            ],

            licenses: [
                {
                    title: "UX Design Professional Certificate",
                    issuer: "Google",
                    date: "2024-2",
                    logo: "https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg",
                    credential: ""
                }
            ]
        }
    ]

};

const response = {
    data: [
        {
            id: 1,
            title: "Պրակտիկա ուսանողների համար",
            content: `
              “NextCode Lab” կազմակերպությունը առաջարկում է
                    <b>Frontend Internship</b>՝ React, TypeScript և Git աշխատելու հմտություններով։
                    Դիմումների ընդունումը բաց է մինչև սեպտեմբերի 10։
                    Դիմել՝ <a href="mailto:intern@nextcode.am">intern@nextcode.am</a>։
            `,

            comments: [

            ]
        },

        {
            id: 2,
            title: "Գործնական ծրագիր",
            content: ` “DataForge” թիմը կազմակերպում է ուսանողական ծրագիր
                    <b>Machine Learning Trainee</b> դիրքի համար։ Պահանջվում են Python-ի հիմքեր և
                    ML-ի հիմնական ալգորիթմների իմացություն։
                    Զանգվածային դիմումներ ընդունվում են էլ. հասցեով՝
                    <a href="mailto:apply@dataforge.ai">apply@dataforge.ai</a>։`,

            comments: [

            ]
        }
    ]
};