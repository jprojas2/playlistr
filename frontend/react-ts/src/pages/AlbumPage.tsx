import React from 'react'
import './AlbumPage.scss'
import SongPage from './SongPage'
import AnimatedLoading from '~/components/AnimatedLoading'
import axios from 'axios'
import { useParams } from 'react-router-dom'

interface AlbumPageProps {
    albumId?: string | null
    backButton?: {
        onClose: () => void
        text: string
    } | null
}

const AlbumPage: React.FC<AlbumPageProps> = (props) => {
    const [loading, setLoading] = React.useState<boolean>(false)
    const [loadingExtraData, setLoadingExtraData] = React.useState<boolean>(false)
    const [albumData, setAlbumData] = React.useState<any>(null)
    const [selectedItem, setSelectedItem] = React.useState<any>(null)
    const { id } = useParams()

    React.useEffect(() => {
        const albumId = props.albumId || id
        setLoading(true)
        axios.get(`/api/v1/albums/${albumId}`).then((res) => {
            setAlbumData(res.data)
            setLoading(false)
        })
    }, [])
    return (
        <div className="album-page">
            {selectedItem && selectedItem._type === 'song' && (
                <SongPage songId={selectedItem.id} backButton={{ onClose: () => setSelectedItem(null), text: `Back to ${albumData.name}` }} />
            )}
            {!selectedItem && props.backButton && (
                <button className="btn btn-sm btn-sm-3d btn-primary back-button" onClick={props.backButton.onClose}>
                    <span>&lt;&nbsp;&nbsp;</span>
                    {props.backButton?.text || 'Back'}
                </button>
            )}
            {!selectedItem && loading && <AnimatedLoading />}
            {!selectedItem && !loading && !albumData && <div className="album-page">Album not found</div>}
            {!selectedItem && !loading && albumData && (
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
