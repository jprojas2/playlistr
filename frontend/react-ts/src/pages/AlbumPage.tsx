import React from 'react'
import './AlbumPage.scss'
import AnimatedLoading from '~/components/AnimatedLoading'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import useResourceInContext from '../hooks/resourceInContext'
import BackButton, { backButtonProps } from '../components/BackButton'

type AlbumPageProps = {
    albumId?: string | null
    albumData?: any
    backButton?: backButtonProps
}

const AlbumPage: React.FC<AlbumPageProps> = (props) => {
    const [loading, setLoading] = React.useState<boolean>(false)
    const [loadingExtraData, setLoadingExtraData] = React.useState<boolean>(false)
    const [albumData, setAlbumData] = React.useState<any>(props.albumData || null)
    const { id } = useParams()
    const { resourceInContext, setSelectedItem } = useResourceInContext(albumData?.name)

    React.useEffect(() => {
        const albumId = props.albumData?.eid || props.albumId || id
        if (window.location.href.includes('/browse')) window.history.pushState({}, '', `/browse/albums/${albumId}`)
        if (albumData) setLoadingExtraData(true)
        else setLoading(true)
        setLoading(true)
        axios.get(`/api/v1/albums/${albumId}`).then((res) => {
            setAlbumData(res.data)
            setLoading(false)
        })
    }, [])

    if (resourceInContext) return resourceInContext

    return (
        <div className="album-page">
            <BackButton text={props.backButton?.text || 'Back to Browse'} onClick={props.backButton?.onClick} />
            {loading && <AnimatedLoading />}
            {!loading && !albumData && <div className="album-page">Album not found</div>}
            {!loading && albumData && (
                <>
                    <div
                        className="album-page-header"
                        style={{ backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(${albumData.image_url})` }}
                    >
                        <h1 className="album-title">{albumData.name}</h1>
                    </div>
                    <div className="album-page-content">
                        {loadingExtraData && <AnimatedLoading />}
                        {!loadingExtraData && (
                            <>
                                <p>Top Songs</p>
                                <div className="album-top-songs">
                                    {(!albumData.top_songs || albumData.top_songs.length === 0) && <div>No songs found</div>}
                                    {albumData.top_songs?.map((song: any, index: number) => (
                                        <div
                                            key={index}
                                            className="album-song"
                                            onClick={() => {
                                                setSelectedItem(song)
                                            }}
                                        >
                                            <div className="album-song-left">
                                                <div className="album-song-img">
                                                    <img src={song.song_art_image_thumbnail_url} alt={song.title} />
                                                </div>
                                                <div className="album-song-info">
                                                    <span className="album-song-title">{song.title}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {albumData.albums && albumData.albums.length > 0 && (
                                    <>
                                        <p>Albums</p>
                                        <div className="album-albums">
                                            {(!albumData.albums || albumData.albums.length === 0) && <div>No albums found</div>}
                                            {albumData.albums?.map((album: any, index: number) => (
                                                <div key={index} className="album-album">
                                                    <div className="album-album-img">
                                                        <img src={album.song_art_image_thumbnail_url} alt={album.title} />
                                                    </div>
                                                    <div className="album-album-info">
                                                        <span className="album-album-title">{album.title}</span>
                                                        <span className="album-album-year">{album.year}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default AlbumPage
