class SessionsController < ApplicationController

	# GET
	# ======================================================
	# ======================================================
	def index



	end
	# ======================================================
	# ======================================================

	# POST
	# ======================================================
	# ======================================================
	def create



	end
	# ======================================================
	# ======================================================

	# DELETE
	# ======================================================
	# ======================================================
	def destroy

		session[:user] = nil

		redirect_to root_url

	end
	# ======================================================
	# ======================================================

end