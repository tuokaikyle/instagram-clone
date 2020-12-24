export const likePost = (id) => {
  fetch('/like', {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('jwt'),
    },
    body: JSON.stringify({ postId: id }),
  })
    .then((res) => res.json())
    .then((res) => {
      // 逻辑 把fetch来的数据 跟state绑定
      const updateLike = data.map((one) => {
        if (one._id === res._id) {
          // return res;
          // 如果后端没有populate
          // 那么这里得
          return { ...one, likes: res.likes };
        } else {
          return one;
        }
      });
      setData(updateLike);
    })
    .catch((err) => {
      console.log(err);
    });
};
export const unLikePost = (id) => {
  fetch('/unlike', {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('jwt'),
    },
    // 此时通过requireLogin, req中已经有了user, 那么再这个req中再加入一个postId
    body: JSON.stringify({ postId: id }),
  })
    .then((res) => res.json())
    .then((res) => {
      // 逻辑 把fetch来的数据 跟state绑定
      const updateUnLike = data.map((one) => {
        if (one._id === res._id) {
          // 如果这里是 return res 那么后端就得populate
          return { ...one, likes: res.likes };
          // return res
        } else {
          return one;
        }
      });
      setData(updateUnLike);
    })
    .catch((err) => {
      console.log(err);
    });
};
export const makeComment = (text, postId) => {
  fetch('/comment', {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('jwt'),
    },
    body: JSON.stringify({ text, postId }),
  })
    .then((res) => res.json())
    .then((res) => {
      const updateComment = data.map((one) => {
        if (one._id === res._id) {
          return res;
        } else {
          return one;
        }
      });
      setData(updateComment);
    })

    .catch((err) => {
      console.log(err);
    });
};

export const deletePost = (postId) => {
  fetch(`/deletepost/${postId}`, {
    method: 'delete',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('jwt'),
    },
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      const newData = data.filter((one) => {
        // 不相等的留下
        return one._id !== res._id;
      });
      setData(newData);
    })
    .catch((err) => {
      console.log(err);
    });
};
