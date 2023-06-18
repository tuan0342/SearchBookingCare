import './App.css';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import ListItem from './component/ListItem';
import axios from "axios";

function App() {
  const [textSearch, setTextSearch] = useState('');
  const [api, setApi] = useState('');
  const [data, setData] = useState([]);  
  const [number, setNumber] = useState(0);
  const [checkScroll, setCheckScroll] = useState(false);

  const handleOnChangeInput = (event) => {
    setTextSearch(event.target.value);
  }

  const handleKeyDown = (event) => {
    if(event.key === 'Enter') {
      setData([]);
      setNumber(1);    
    }
  }



  const loadMore = () => {
    if(window.innerHeight + document.documentElement.scrollTop >= document.scrollingElement.scrollHeight &&
      document.scrollingElement.scrollHeight > window.innerHeight) {
      setNumber(number + 10);
      // setData([]);      
    }
  }

  // thiết lập API
  useEffect(() => {
    if(textSearch.trim() !== "") {
      // setApi(`https://www.googleapis.com/customsearch/v1/siterestrict?key=AIzaSyB5G_97atcnTemBbWrMOlgs9UN4_XlVOSc&fields=items(title,link,snippet,pagemap/cse_image/src)&cx=6777219cb9ebc4cfc&q=${textSearch}&start=${number}`)
      setApi(`https://www.googleapis.com/customsearch/v1/siterestrict?key=AIzaSyARYHEhfGSjYzsNowljOUQdieIuyhY6aTs&fields=items(title,link,snippet,pagemap/cse_image/src)&cx=854e4050a22804639&q=${textSearch}&start=${number}`)   // main
    }
  }, [number])


  // lấy data dựa vào API vừa thiết lập
  useEffect(() => {
    axios
        .get(api)
        .then(function(response) {
          var promise = new Promise(
            function(resolve, reject) {
              let value = response.data.items.map(eachValue => {
                return {
                  title: eachValue.title,
                  body: eachValue.snippet,
                  image: eachValue.pagemap !== undefined ? eachValue.pagemap.cse_image[0].src : 'https://vapa.vn/wp-content/uploads/2022/12/anh-nen-trang-001.jpg',
                  link: eachValue.link,
                }
              })
              if(value.length > 0) resolve(value);
              else reject();
            }
          )
          promise
            .then(function(value) {
              if(data.length === 0) {
                setData(value);
                setNumber(number + 10);
              } else if (data.length >= 10) {
                let tmp = data.concat(value);
                setData(tmp);
                checkScroll === false ? setCheckScroll(true) : setCheckScroll(false);
              } else {
              }
            })
            .catch(function() {})
            .finally(function() {});
        })
        .catch(function (error) {
            if (axios.isCancel(error)) {  //  canceled
                console.log('>> Error request cancel: ',error.message);
            } else {  // ko cancel thì load thông báo  
                console.log('>> Not error request cancel: ', error);
            }
            // setData([])
        })
        .finally(function () {
        });
  }, [api])


  // khi cuộn xuống cuối trang -> lấy thêm dữ liệu để hiển thị
  useEffect(() => {
    window.addEventListener('scroll', loadMore);

    return () => {
      window.removeEventListener('scroll', loadMore);
    };
  }, [checkScroll])

  return (
    <div className="App">
      {/* Header */}
      <header className="App-header">
        <img className='header-image' height={40} width={160} src="https://bookingcare.vn/assets/icon/bookingcare-2020.svg" alt='BookingCare' />
        
        <div className='header-timkiem-form'>
          <div className='header-timkiem'>
            <div className='header-timkiem-icon'>
              <FontAwesomeIcon icon={faSearch} />
            </div>
            <input id='timkiem' type='text' placeholder='Tìm kiếm' 
              value={textSearch} onChange={(event) => handleOnChangeInput(event)}
              onKeyDown={(event) => handleKeyDown(event)}
            />
          </div>
        </div>

        <div className='header-hotro' >
          <span style={{color: '#969495'}}>Hỗ trợ</span>
          <span style={{fontSize: 12, color: '#45c3d2'}}>024-7301-2468</span>
        </div>
      </header> 

      <hr  width="95%" align="center" />

      {/* Body */}
      <div style={{marginLeft: 35, marginTop: 30}}>
        {/* Nếu có dữ liệu */}
        {data && data.length > 10 && data.map((item) =>{
          return(
            <ListItem data={item} key={item.link}/>
          )
        })}
        
        {/* Nếu không có dữ liệu */}
        {data.length === 0 && 
            <div className='body-no-data'>
              <h2 style={{color: '#45c3d2', marginBottom: 10}}>TÌM KIẾM TRÊN BOOKINGCARE</h2>
              {/* <h1 style={{fontSize: 30, color: '#45c3d2'}} > NỀN TẢNG Y TẾ </h1>
              <h1 style={{fontSize: 30, marginBottom: 30, color: '#45c3d2'}} > CHĂM SÓC SỨC KHỎE TOÀN DIỆN </h1> */}
            </div>
        }

        <div style={{paddingBottom: 50}}></div>
      </div>
    </div>
  );
}

export default App;
