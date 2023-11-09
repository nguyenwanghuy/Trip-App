import React, { useEffect, useState } from 'react';
import { NavBar } from '../components';
import { useParams } from 'react-router-dom';
import { apiRequest } from '../utils';
import { useSelector } from 'react-redux';

const Search = () => {
  const { query } = useParams();
  console.log(query);
  const { user } = useSelector((state) => state.user);
  const [searchUsersData, setSearchUsersData] = useState([]);

  useEffect(() => {
    // Fetch data from your API using the query parameter
    const fetchData = async () => {
      try {
        const res = await apiRequest({
          url: `/user/search/s?u=${query}`,
          token: user.token,
          method: 'GET',
        });
        console.log(res);
        setSearchUsersData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [query]);

  return (
    <div className='w-full px-0 lg:px-10 pb-20 2xl:px-20 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
      <NavBar />

      <div>
        <h2>Search Results:</h2>
        <ul>
          {!searchUsersData || searchUsersData.length === 0 ? (
            <p>No results found</p>
          ) : (
            searchUsersData.map((user) => (
              <li key={user._id}>
                <div>
                  <img
                    src={user.avatar || 'default-avatar-url'}
                    alt='User Avatar'
                    className='w-10 h-10'
                  />
                </div>
                <div>
                  <p>{user.username}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Search;
