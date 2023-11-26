import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../../utils';
import { useSelector } from 'react-redux';
import { BsThreeDots } from 'react-icons/bs';
import { Button, Dropdown, Space } from 'antd';
import UseFunction from '../../Function/UseFunction';

const AlbumInfo = ({ selectedAlbum, handleAlbumSubmit }) => {
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [album, setAlbum] = useState(null);
  const { handleDeleteAlbum } = UseFunction();
  const navigate = useNavigate();

  const fetchAlbum = async () => {
    try {
      const res = await apiRequest({
        url: `/album/users/${selectedAlbum}`,
        token: user.token,
        method: 'GET',
      });
      setAlbum(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAlbum && user.token) {
      fetchAlbum();
    }
  }, [selectedAlbum, user.token]);

  const isCurrentUserAlbum = album && user._id === album.user._id;

  const handleUpdate = (album) => {
    navigate(`/trip/album/edit/${album._id}`, {
      state: { existingData: album },
    });
  };

  const menuItems = [
    isCurrentUserAlbum && {
      label: 'Update',
      key: 'update',
      onClick: () => handleUpdate(album),
    },
    isCurrentUserAlbum && {
      label: 'Delete',
      key: 'delete',
      onClick: () => handleDeleteAlbum(album._id),
    },
  ].filter(Boolean);
  return (
    <div>
      {loading && <p>Loading...</p>}
      {!loading && album && (
        <div>
          <div className='w-full px-4 py-4 my-6 rounded-lg text-left  bg-ascent-3 text-ascent-1'>
            <div className=' flex flex-row justify-between'>
              <div className='text-4xl font-bold'>{album.albumName}</div>
              <Dropdown
                menu={{
                  items: menuItems,
                }}
                trigger={['click']}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <BsThreeDots />
                  </Space>
                </a>
              </Dropdown>
            </div>
            <div>
              {album.images.length}
              {album.images.length === 1 ? ' image' : ' images'}
            </div>
          </div>

          <div className='my-6 w-full grid grid-cols-5 gap-4 bg-ascent-3 px-4 py-4'>
            {album.images.map((image, index) => (
              <div key={index}>
                <img
                  src={image.url}
                  alt={image.description}
                  className='w-full h-40'
                />
                <p>{image.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {!loading && !album && <p>No data available</p>}
    </div>
  );
};

export default AlbumInfo;
