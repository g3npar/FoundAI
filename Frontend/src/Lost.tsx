import  {useState, useEffect} from 'react';
import axios from 'axios';
import "./post.css";

export default function Lost () {
    const [postData, setPostData] = useState<any[]>([]);
    
    useEffect(() => {
        const fetchPosts = async() => {
            try{
                const res = await axios.get('http://127.0.0.1:8000/api/get_lost')
                console.log(res.data)
                setPostData(res.data)
            }
            catch(err){
                console.log(err)
            }
        }
        fetchPosts()
    },[]);

    useEffect(() => {
        console.log(postData)
    }, [postData]);

    return (
        <>
            <h1>Lost</h1>

            {
                postData.map((post) => (
                <div className='post'>
                    <div>{post.title}</div>
                    <div><img src={post.picture} alt={post.picture}/></div>
                    <div>{post.description}</div>
                    <div>{post.email}</div>
                    <div>{post.number}</div>
                    <div>{post.location}</div>
                    <div>{post.date}</div>
                    <div>{post.time}</div>
                </div>
                ))
            }
        </>
    );
}