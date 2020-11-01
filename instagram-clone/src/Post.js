import React, { useEffect, useState } from 'react';
import './Post.css'
import Avatar from "@material-ui/core/Avatar"
import { db } from './firebase';
import { Button, Input } from '@material-ui/core'
import firebase from 'firebase';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

function Post({ postID, user, username, caption, imageURL }) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [liked, setLiked] = useState([])
    const [like, setLike] = useState('')

    useEffect(() => {
        let unsubscribe;
        if (postID)
        {
            unsubscribe = db
                .collection('posts')
                .doc(postID)
                .collection('comments')
                .orderBy('timestamp', "desc")
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                });
        }

        return() => {
            unsubscribe();
        }
    }, [postID]);

    const postComment = (event) => {
        event.preventDefault();

        db.collection('posts').doc(postID).collection('comments').add({
            text: comment,
            username: user.displayName ,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    const handleLikes = (event) => {
        event.preventDefault();

        db.collection('posts').doc(postID).collection('LikedUsers').add({
            user
        })
    }

    return (
        <div className="post">
            
            {/* header -> avatar + username */}
            <div className="post__header">
                <Avatar 
                className="post__avatar"
                alt="SidKarthik"
                src="/static/images/avatar/1.jpg"
                />
                <h3>{username}</h3>
            </div>
            {/* Image */}
            <img 
            className="post__image"
            src={imageURL}
            alt=""
            />

            {/* Like button */}
            <div className="post__like">
                <FavoriteBorderIcon onClick={handleLikes}/>
            </div>

            {/* username + caption */}
            <h4 className="post__text"><strong>{username} </strong>{caption}</h4>

            {/* Comments */}
            <div className="post__comments">
                {
                    comments.map((comment) => (
                        <p>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                    ))
                }  
            </div>
            
            {user && (
                <form className="post__commentBox">
                <Input
                    className="post__comment"
                    type="text"
                    multiline
                    placeholder="Add a comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <Button
                    className="post__comment_button"
                    disabled={!comment}
                    type = "submit"
                    onClick={postComment}
                    variant="contained"
                    color="secondary"
                >
                    Post
                </Button>
            </form>
            )}

            
        </div>
    )
}

export default Post
