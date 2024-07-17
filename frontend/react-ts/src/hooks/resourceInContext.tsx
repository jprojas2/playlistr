import React from 'react'
import AlbumPage from '~/pages/AlbumPage'
import ArtistPage from '~/pages/ArtistPage'
import SongPage from '~/pages/SongPage'

const useResourceInContext = (context: string, url?: string | null, beforeBack?: Function) => {
    const [selectedItem, setSelectedItem] = React.useState<any>(null)
    let resourceInContext: JSX.Element | null = null

    const onClick = () => {
        if (beforeBack) beforeBack().then(() => setSelectedItem(null))
        else setSelectedItem(null)
    }

    // React.useEffect(() => {
    //     if (url) window.history.replaceState(null, '', url)
    // }, [])

    // React.useEffect(() => {
    //     if (!selectedItem && url) window.history.replaceState(null, '', url)
    // }, [selectedItem])

    const text = `Back to ${context}`
    if (selectedItem)
        resourceInContext = (
            <>
                {selectedItem._type == 'artist' && <ArtistPage artistData={selectedItem} backButton={{ onClick: onClick, text: text }} />}
                {selectedItem._type == 'song' && <SongPage songData={selectedItem} backButton={{ onClick: onClick, text: text }} />}
                {selectedItem._type == 'album' && <AlbumPage albumData={selectedItem} backButton={{ onClick: onClick, text: text }} />}
            </>
        )

    return { resourceInContext, setSelectedItem }
}

export default useResourceInContext
