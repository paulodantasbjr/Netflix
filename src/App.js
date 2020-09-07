import React, { useEffect, useState } from 'react';
import Tmdb from './Tmdb'
import MovieRow from './components/MovieRow';
import './App.css';
import FeaturedMovie from './components/FeaturedMovie'
import Header from './components/Header'
import Footer from './components/Footer'


export default () => {

    const [movieList, setMovieList] = useState([]);
    const [featuredData, setFeaturedData] = useState([null]);
    const [blackHeader, setBlackHeader] = useState(false)

    useEffect(() => {
        const loadAll = async () => {
            let list = await Tmdb.getHomeList();
            setMovieList(list);

            let originals = list.filter(i=> i.slug === 'originals');
            let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length -1));
            let chosen = originals[0].items.results[randomChosen];
            let chosenInfo = await Tmdb.getMovieInfo(chosen.id,'tv');
            setFeaturedData(chosenInfo);
        }
        loadAll();
    }, []);

    useEffect(()=>{
        const scrollListener = () =>{
            if (window.scrollY > 100) {
                setBlackHeader(true)
            }else{
                setBlackHeader(false)
            }
        }
        window.addEventListener('scroll', scrollListener);
        return () =>{
            window.removeEventListener('scroll', scrollListener);
        }
    },[]);

    return (
        <div className="page">

            <Header black={blackHeader}/>

            {featuredData &&
                <FeaturedMovie item={featuredData}/>
            }
            
            <section className="list">
                {movieList.map((item, key) => (
                    <div>
                        <MovieRow key={key} title={item.title} items={item.items} />
                    </div>
                ))}
            </section>
            <Footer />
        </div>
    );
}