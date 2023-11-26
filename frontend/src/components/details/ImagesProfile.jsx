import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spin, Tabs } from 'antd';
import { Link, useParams } from 'react-router-dom';
import UseFunction from '../Function/UseFunction';
import { useSelector } from 'react-redux';
import { apiRequest } from '../../utils';
import Loading from '../Loading';
import AlbumInfo from './ImageDetails/AlbumInfo';

const { TabPane } = Tabs;

const ImagesProfile = ({ UserId, userInfo }) => {
  const { user } = useSelector((state) => state.user);

  const { albums } = useSelector((state) => state.album);
  console.log(albums);
  const { handleLikePost, fetchAlbum, handleDeletePost } = UseFunction();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  useEffect(() => {
    fetchAlbum();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await apiRequest({
        url: `/post/${UserId}`,
        token: user.token,
        method: 'GET',
      });
      console.log(res);
      setPosts(res.posts);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, [UserId, user.token]);

  const userAlbums = Array.isArray(albums)
    ? albums.filter((album) => album.user._id === userInfo._id)
    : [];

  const flattenedImages = posts.flatMap((post) => post.image);

  const handleAlbumClick = (albumId) => {
    console.log(albumId);
    setSelectedAlbum(albumId);
  };

  return (
    <Spin spinning={loading}>
      <Tabs defaultActiveKey='1' className='bg-ascent-3 px-4 py-4'>
        <TabPane tab='Albums' key='1'>
          <div className='grid grid-cols-5 gap-4'>
            {user._id === userInfo?._id && (
              <div>
                <Link to='/trip/create-album'>
                  <Card className='h-full flex items-center justify-center'>
                    <div className='text-6xl rounded-full w-20 h-20 text-ascent-2 border-ascent-2 border-dashed border-4'>
                      +
                    </div>
                  </Card>
                </Link>
              </div>
            )}
            {userAlbums
              .filter((album) => album.viewers.includes(user._id))
              .map((album) => (
                <Col key={album._id}>
                  <div onClick={() => handleAlbumClick(album._id)}>
                    <Card>
                      <div>
                        <img
                          src={album.images[0].url}
                          alt={`Cover Image for ${album.albumName}`}
                          className='w-full h-40'
                        />
                      </div>
                      <p className='font-semibold pt-4'>{album.albumName}</p>
                    </Card>
                  </div>
                </Col>
              ))}
          </div>
        </TabPane>

        <TabPane tab='Posts' key='2'>
          <div className='w-full grid grid-cols-5 gap-4'>
            {loading ? (
              <Loading />
            ) : posts && posts.length > 0 ? (
              flattenedImages.map((imageUrl, imgIndex) => (
                <img
                  key={imgIndex}
                  src={imageUrl}
                  alt={`Post Image ${imgIndex + 1}`}
                  className='w-full h-full'
                />
              ))
            ) : (
              <div className='flex w-full h-full items-center justify-center'>
                <p className='text-lg text-ascent-2'>No Post Available</p>
              </div>
            )}
          </div>
        </TabPane>
      </Tabs>

      {selectedAlbum && <AlbumInfo selectedAlbum={selectedAlbum} />}
    </Spin>
  );
};

export default ImagesProfile;
