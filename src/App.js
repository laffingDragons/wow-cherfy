import React, { useState, useEffect, useRef } from 'react';
import Table from "./components/Table";
import Header from "./components/Header";
import './App.css'


const App = () => {

  const [products, setProducts] = useState();
  const [productsList, setProductsList] = useState();
  const [revenue, setRevenue] = useState();
  const searchVal = useRef();

  // pagination code starts here 
  const [page, setPageIndex] = useState({ pageSize: 10, pageIndex: 0, noOfPages: 0 });
  const pageSize = page.pageSize;
  const pageIndex = page.pageIndex;
  const noOfPages = page.noOfPages;

  useEffect(() => {
    console.clear();
    fetchAndMergeBranch();
  }, []);

  const fetchtData = (url) => {
    return fetch(url,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }).then(response => response.json())
      .then(data => data);
  }



  const fetchAndMergeBranch = async () => {

    Promise.all([
      fetchtData(`./api/branch1.json`),
      fetchtData(`./api/branch2.json`),
      fetchtData(`./api/branch3.json`),
    ]).then(res => {
      let tableData = [...res[0].products, ...res[1].products, ...res[2].products];
      tableData = mergeSimilar(tableData);
      tableData = sortByName(tableData);
      console.log("🚀 ~ doGetUsers ~ tableData", (tableData));
      setProducts(tableData);
      setProductsList(tableData);
      calcNoOfPages(tableData.length);
    })
  };

  const mergeSimilar = (obj) => {
    const out = obj.reduce((a, v) => {
      if (a[v.name]) {
        a[v.name].sold = a[v.name].sold + v.sold;
      } else {
        a[v.name] = v
      }
      return a
    }, {})

    return Object.values(out);
  }

  const sortByName = (tableData) => {
    let val = 'name';
    return tableData.sort(function (a, b) {
      if (a[val] < b[val]) { return -1; }
      if (a[val] > b[val]) { return 1; }
      return 0;
    });
  }


  const  calcNoOfPages = (noOfResults, startFrom) => {
    let pages = noOfResults % pageSize ? Math.floor(noOfResults / pageSize) + 1 : (noOfResults / pageSize);
    setPageIndex((prevData) => {
      if(startFrom ){
        return { ...prevData, noOfPages: pages , pageIndex : 0}

      }else{
        
        return { ...prevData, noOfPages: pages }
      }
    })
  }

  function debounce(fn, delay = 500) {
    let timer;
    return function () {
        clearTimeout(timer)
        timer = setTimeout(() => {
          filterProducts();
        }, delay);
    }()
}

  {/* Pagination starts here  */ }
  const Pagination = () => {
    return (
      <div className="row text-center mt-4">
        <p className='flex-wrap mt-4'>
          {[...Array(noOfPages).keys()].map(i => {
            return (
              <span key={i} className={pageIndex === i ? "page-active" : "page"}
                onClick={e => { setPageIndex(prevData => { return { ...prevData, pageIndex: i } }) }}>
                {i + 1}
              </span>
            )
          })}
        </p>
      </div>
    )
  }
  {/* Pagination Ends here  */ }


  const filterProducts = () => {
    let search = searchVal.current.value.toLowerCase();
    if (!search) {
      setProducts(productsList);
      calcNoOfPages(productsList.length, true);
    }
    else {
      const filterList = productsList.filter(obj => {
        return obj.name.toLowerCase().includes(search);
      })
      console.log("🚀 ~ filterProducts ", filterList)
      setProducts(filterList);
      
      calcNoOfPages(filterList.length, true);
    };


  }

  function formatNumber() {
    let total = 0

    products.map(product => {
      total = (product.unitPrice * product.sold) + total;
    })

    return total.toFixed(2);
  }


  return (
    <>
      <div className="container">

        <Header />
        {
          products ?
            <div className='d-flex p-2 justify-content-between'>
              <div>
                Total revenue :  <b>{formatNumber()}</b>
              </div>
              <input className='search-input' ref={searchVal} type="text" onChange={debounce} placeholder="Search..." />
            </div> : ''
        }
        <div>
          {
            products ? <Table tableData={products.slice(pageIndex * pageSize, (pageIndex * pageSize) + pageSize)} /> :
              <div class="spinner-border" role="status"></div>
          }

          <Pagination />

        </div>
      </div>
    </>
  )
}



export default App