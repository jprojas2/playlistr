Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check


  # root "posts#index"
  namespace :api do
    post '/login', to: 'authentication#login'
    namespace :v1 do
      resource :player
      resources :songs, param: :eid do
        member do
          get :lyrics
        end
      end
      resources :artists, param: :eid
      resources :albums, param: :eid
      resources :playlists
      resources :users, param: :_username, except: %[i new]
      get '/search', to: 'search#index'
    end
  end
  
  options '*path', to: 'application#cors_preflight_check'

  get '/*a', to: 'application#not_found'
end
