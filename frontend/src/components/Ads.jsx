import React, { useEffect, useState } from 'react';
import Adc from '../assets/phuquoc.jpg';
import Adc2 from '../assets/nhatrang.jpg';

const Ads = () => {
  const [showAds, setShowAds] = useState(false);
  const [showAds2, setShowAds2] = useState(false);

  useEffect(() => {
    const showTimeoutAd = setTimeout(() => {
      setShowAds(true);
    }, 3000);

    const hideTimeoutAd = setTimeout(() => {
      setShowAds(false);
    }, 10000);

    return () => {
      clearTimeout(showTimeoutAd);
      clearTimeout(hideTimeoutAd);
    };
  }, []);

  useEffect(() => {
    const showTimeoutAd2 = setTimeout(() => {
      setShowAds2(true);
    }, 13000);

    const hideTimeoutAd2 = setTimeout(() => {
      setShowAds2(false);
    }, 20000);

    return () => {
      clearTimeout(showTimeoutAd2);
      clearTimeout(hideTimeoutAd2);
    };
  }, []);

  return (
    <div className='ads'>
      {showAds && (
       <a href='https://www.klook.com/vi/activity/11989-vinwonder-phu-quoc-ticket/?spm=SearchResult.SearchResult_LIST&clickId=c58fe3c99d'>
         <img src={Adc} alt='Quang cao' />
       </a>
      )}
      {showAds2 && (
        <a href='https://www.kkday.com/vi/product/100864-vinwonders-nha-trang-theme-park-ticket'>
            <img src={Adc2} alt='Quang cao' />
        </a>
      )}
    </div>
  );
};

export default Ads;