class StaticController < ApplicationController
  def index
  end

  def testing
  	render layout: false
  end
end
