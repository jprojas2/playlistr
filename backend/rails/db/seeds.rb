# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

if Rails.env.development?
  user = User.create!(name: 'Test User', username: 'testuser', email: 'test@mail.com', password: 'password')
  user2 = User.create!(name: 'Test User 2', username: 'testuser2', email: 'test2@mail.com', password: 'password')

  artist = Artist.create!(eid: '1', name: 'Test Artist', image_url: 'https://via.placeholder.com/150')
  album = Album.create!(eid: '1', name: 'Test Album', year: '2021', image_url: 'https://via.placeholder.com/150')
  song = Song.create!(eid: '1', name: 'Test Song', artist_id: artist.id, album_id: album.id, favorite: 'false', lyrics: 'Test Lyrics', duration: '3:00', image_url: 'https://via.placeholder.com/150')
  artist2 = Artist.create!(eid: '2', name: 'Test Artist 2', image_url: 'https://via.placeholder.com/150')
  album2 = Album.create!(eid: '2', name: 'Test Album 2', year: '2021', image_url: 'https://via.placeholder.com/150')
  song2 = Song.create!(eid: '2', name: 'Test Song 2', artist_id: artist2.id, album_id: album2.id, favorite: 'false', lyrics: 'Test Lyrics 2', duration: '3:00', image_url: 'https://via.placeholder.com/150')

  song_with_no_artist_or_album = Song.create!(eid: '3', name: 'Test Song 3', favorite: 'false', lyrics: 'Test Lyrics 3', duration: '3:00', image_url: 'https://via.placeholder.com/150')  

  playlist = Playlist.create!(name: 'Test Playlist', user_id: user.id)
  playlist.playlist_songs.create(song_id: song.id, song_index: 0)
  playlist.playlist_songs.create(song_id: song2.id, song_index: 1)
  playlist2 = Playlist.create!(name: 'Test Playlist 2', user_id: user2.id)
  playlist2.playlist_songs.create(song_id: song2.id, song_index: 0)
  playlist2.playlist_songs.create(song_id: song.id, song_index: 1)

  player = Player.create!(user_id: user.id, playing_index: 0)
  player_item = PlayerItem.create!(player_id: player.id, song_id: song.id, song_index: 1)
  player_item = PlayerItem.create!(player_id: player.id, song_id: song2.id, song_index: 0)
end