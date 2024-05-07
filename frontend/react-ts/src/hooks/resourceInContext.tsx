import React from 'react'
import AlbumPage from '~/pages/AlbumPage'
import ArtistPage from '~/pages/ArtistPage'
import SongPage from '~/pages/SongPage'

const useResourceInContext = (context: string) => {
    const [selectedItem, setSelectedItem] = React.useState<any>(null)
    let resourceInContext: JSX.Element | null = null
    if (selectedItem)
        resourceInContext = (
            <>
                {selectedItem._type == 'artist' && (
                    <ArtistPage artistData={selectedItem} backButton={{ onClick: () => setSelectedItem(null), text: `Back to ${context}` }} />
                )}
                {selectedItem._type == 'song' && (
                    <SongPage songData={selectedItem} backButton={{ onClick: () => setSelectedItem(null), text: `Back to ${context}` }} />
                )}
                {selectedItem._type == 'album' && (
                    <AlbumPage albumData={selectedItem} backButton={{ onClick: () => setSelectedItem(null), text: `Back to ${context}` }} />
                )}
            </>
        )

    return { resourceInContext, setSelectedItem }
}

export default useResourceInContext
