Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check


  # root "posts#index"
  namespace :api do
    post '/login', to: 'authentication#login'
    namespace :v1 do
      resource :player do
        member do
          get :get_duration
          post :play
          post :pause
          post :next
          post :previous
          post :rewind
        end
      end
      resources :songs, param: :eid, only: %i[ index show ] do
        member do
          get :lyrics
          post :play
          post :favorite
          post :unfavorite
          post :play_next
          post :add_to_queue
        end
      end
      resources :artists, param: :eid, only: %i[ index show ]
      resources :albums, param: :eid, only: %i[ index show ]
      resources :playlists do
        member do
          post :play
          post :reorder
          post :remove_song
        end
        resources :playlist_songs, param: :song_index, only: %i[ index create destroy ] do
          member do
            post :play
          end
        end
      end
      resources :users, param: :_username, except: %[i new]
      resource :user do
        member do
          delete :delete_avatar
        end
      end
      resources :favorites, only: %i[ index destroy ] do
        collection do
          post :reorder
        end
        member do
          post :play
        end
      end

      get '/search', to: 'search#index'
    end
  end
  
  options '*path', to: 'application#cors_preflight_check'
end
