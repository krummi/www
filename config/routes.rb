Eiriksson::Application.routes.draw do
  resources :blogs do |d|
  	patch '/publish' => 'blogs#publish'
  end

  root 'static#index'

  get '/p2p' => 'static#p2p'
end
