<?php

namespace App\Http\Controllers;

use App\Http\Requests\CompanyStoreRequest;
use App\Http\Requests\CompanyUpdateRequest;
use App\Models\Company;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function store(CompanyStoreRequest $request): RedirectResponse
    {
        Company::query()->create([
            'name' => $request->validated('name'),
            'user_id' => Auth::id(),
        ]);

        return back();
    }

    public function index(): Response
    {
        $companies = Company::query()
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('company', [
            'companies' => $companies,
        ]);
    }

    public function update(CompanyUpdateRequest $request, Company $company): RedirectResponse
    {
        if ($company->user_id !== Auth::id()) {
            abort(403);
        }

        $company->update($request->validated());

        return back();
    }

    public function destroy(Company $company): RedirectResponse
    {
        if ($company->user_id !== Auth::id()) {
            abort(403);
        }

        $company->delete();

        return back();
    }
}
