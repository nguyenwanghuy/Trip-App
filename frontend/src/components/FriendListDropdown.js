import React, { useState } from 'react';

const FriendListDropdown = ({ friends, onSelectFriend, selectedFriends }) => {
  const [prevSelectedFriends, setPrevSelectedFriends] = useState([]);

  const handleCheckboxChange = (friendId) => {
    onSelectFriend((prevSelectedFriends) => {
      const isSelected = prevSelectedFriends.includes(friendId);

      if (isSelected) {
        return prevSelectedFriends.filter((id) => id !== friendId);
      } else {
        return [...prevSelectedFriends, friendId];
      }
    });
  };

  return (
    <div className='friend-list-dropdown'>
      <ul>
        {friends.map((friend) => (
          <li key={friend._id}>
            <label>
              <input
                type='checkbox'
                checked={selectedFriends.includes(friend._id)}
                onChange={() => handleCheckboxChange(friend._id)}
              />
              {friend.username}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendListDropdown;
