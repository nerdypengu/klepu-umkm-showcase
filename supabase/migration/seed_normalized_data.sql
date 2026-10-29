-- ============================================================================
-- UMKM KLEPU: Seed Normalized Tables from Existing public.umkm.data JSONB
-- Safe & Idempotent: Old public.umkm table remains untouched.
-- ============================================================================

DO $$
DECLARE
    r RECORD;
    d JSONB;
    v_umkm_id TEXT;
    v_prod_id UUID;
    item JSONB;
    v_price_num NUMERIC;
    v_qty_num NUMERIC;
    v_unit_str TEXT;
    txt TEXT;
BEGIN
    FOR r IN SELECT id, slug, data FROM public.umkm WHERE data IS NOT NULL LOOP
        d := r.data;
        v_umkm_id := r.id;

        -- 1. Slugs
        INSERT INTO public.umkm_slugs (umkm_id, slug, is_primary)
        VALUES (v_umkm_id, coalesce(d->>'slug', r.slug), true)
        ON CONFLICT (slug) DO NOTHING;

        -- 2. Investments
        INSERT INTO public.umkm_investments (
            umkm_id,
            readiness,
            readiness_reason,
            investment_display,
            market,
            market_note,
            opportunity_context
        ) VALUES (
            v_umkm_id,
            CASE
                WHEN lower(coalesce(d->>'readiness', '')) LIKE '%siap berkembang%' THEN 'siap'
                WHEN lower(coalesce(d->>'readiness', '')) LIKE '%prospektif%' THEN 'siap'
                WHEN lower(coalesce(d->>'readiness', '')) LIKE '%aktif dikembangkan%' THEN 'dipertimbangkan'
                ELSE 'dipertimbangkan'
            END,
            d->>'prioritySummary',
            d->>'investment',
            d->>'market',
            d->>'marketNote',
            d->>'opportunityContext'
        )
        ON CONFLICT (umkm_id) DO UPDATE SET
            investment_display = EXCLUDED.investment_display,
            market = EXCLUDED.market,
            market_note = EXCLUDED.market_note,
            opportunity_context = EXCLUDED.opportunity_context;

        -- 3. Feasibility Scores
        IF d ? 'score' THEN
            INSERT INTO public.umkm_scores (
                umkm_id,
                score_market,
                score_finance,
                score_materials,
                score_technology,
                score_distribution,
                priority_rank,
                priority_total,
                priority_summary
            ) VALUES (
                v_umkm_id,
                coalesce((d->'score'->>'market')::int, 0),
                coalesce((d->'score'->>'finance')::int, 0),
                coalesce((d->'score'->>'materials')::int, 0),
                coalesce((d->'score'->>'technology')::int, 0),
                coalesce((d->'score'->>'distribution')::int, 0),
                (d->>'priorityRank')::int,
                (d->>'priorityTotal')::int,
                d->>'prioritySummary'
            )
            ON CONFLICT (umkm_id) DO UPDATE SET
                score_market = EXCLUDED.score_market,
                score_finance = EXCLUDED.score_finance,
                score_materials = EXCLUDED.score_materials,
                score_technology = EXCLUDED.score_technology,
                score_distribution = EXCLUDED.score_distribution;
        END IF;

        -- 4. ROI Simulation
        IF d ? 'roiSimulation' THEN
            INSERT INTO public.umkm_roi (
                umkm_id,
                roi_basis,
                notes
            ) VALUES (
                v_umkm_id,
                d->'roiSimulation'->>'basis',
                'Simulasi ROI: ' || coalesce(d->'roiSimulation'->>'roi', '-') || ', Payback: ' || coalesce(d->'roiSimulation'->>'payback', '-')
            )
            ON CONFLICT (umkm_id) DO UPDATE SET
                roi_basis = EXCLUDED.roi_basis,
                notes = EXCLUDED.notes;
        END IF;

        -- 5. Primary Product
        IF d ? 'product' THEN
            -- Extract price numbers
            v_price_num := CASE
                WHEN v_umkm_id = 'UMKM-001' THEN 17000
                WHEN v_umkm_id = 'UMKM-002' THEN 17000
                WHEN v_umkm_id = 'UMKM-003' THEN 40000
                WHEN v_umkm_id = 'UMKM-004' THEN 11000
                WHEN v_umkm_id = 'UMKM-005' THEN 4500
                WHEN v_umkm_id = 'UMKM-006' THEN 45000
                ELSE 15000
            END;

            v_qty_num := CASE
                WHEN v_umkm_id = 'UMKM-001' THEN 150
                WHEN v_umkm_id = 'UMKM-002' THEN 200
                WHEN v_umkm_id = 'UMKM-003' THEN 200
                ELSE 1
            END;

            v_unit_str := CASE
                WHEN v_umkm_id IN ('UMKM-001', 'UMKM-002', 'UMKM-003') THEN 'gram'
                WHEN v_umkm_id IN ('UMKM-004', 'UMKM-005') THEN 'kemasan'
                WHEN v_umkm_id = 'UMKM-006' THEN 'pcs'
                ELSE 'porsi'
            END;

            INSERT INTO public.umkm_products (
                umkm_id,
                name,
                description,
                price,
                quantity,
                unit,
                is_primary
            ) VALUES (
                v_umkm_id,
                d->>'product',
                d->>'description',
                v_price_num,
                v_qty_num,
                v_unit_str,
                true
            )
            RETURNING id INTO v_prod_id;

            -- Multi-tier product for Kopi Family
            IF v_umkm_id = 'UMKM-001' THEN
                INSERT INTO public.umkm_products (umkm_id, name, description, price, quantity, unit, is_primary)
                VALUES (v_umkm_id, 'Kopi Family Kemasan 50g', 'Kemasan ekonomis kopi liberika pegunungan Banyu Putih', 7500, 50, 'gram', false);
            END IF;
        END IF;

        -- 6. Media (Cover image)
        IF d ? 'image' AND d->>'image' IS NOT NULL THEN
            INSERT INTO public.umkm_media (umkm_id, media_type, url, alt_text, is_cover)
            VALUES (v_umkm_id, 'image', d->>'image', d->>'imageAlt', true);
        END IF;

        -- Media (Videos)
        IF d ? 'videos' THEN
            FOR item IN SELECT * FROM jsonb_array_elements(d->'videos') LOOP
                INSERT INTO public.umkm_media (umkm_id, media_type, url, poster_url)
                VALUES (v_umkm_id, 'video', item->>'src', item->>'poster');
            END LOOP;
        END IF;

        -- 7. Opportunities
        IF d ? 'opportunities' THEN
            FOR item IN SELECT * FROM jsonb_array_elements(d->'opportunities') LOOP
                INSERT INTO public.umkm_opportunities (
                    umkm_id,
                    name,
                    investment_display,
                    detail,
                    recommended,
                    recommended_reason
                ) VALUES (
                    v_umkm_id,
                    item->>'name',
                    item->>'investment',
                    item->>'detail',
                    coalesce((item->>'recommended')::boolean, false),
                    item->>'recommendedReason'
                );
            END LOOP;
        END IF;

        -- 8. Facts
        IF d ? 'facts' THEN
            FOR item IN SELECT * FROM jsonb_array_elements(d->'facts') LOOP
                INSERT INTO public.umkm_facts (umkm_id, label, value)
                VALUES (v_umkm_id, item->>'label', item->>'value');
            END LOOP;
        END IF;

        -- 9. Operations
        IF d ? 'operations' THEN
            FOR item IN SELECT * FROM jsonb_array_elements(d->'operations') LOOP
                INSERT INTO public.umkm_operations (umkm_id, label, value)
                VALUES (v_umkm_id, item->>'label', item->>'value');
            END LOOP;
        END IF;

        -- 10. Roles
        IF d ? 'roles' THEN
            FOR item IN SELECT * FROM jsonb_array_elements(d->'roles') LOOP
                INSERT INTO public.umkm_roles (umkm_id, label, value)
                VALUES (v_umkm_id, item->>'label', item->>'value');
            END LOOP;
        END IF;

        -- 11. List Items (Risks, Mitigations, Prerequisites, Market Targets, Gaps, Potentials, Investment Use)
        IF d ? 'risks' THEN
            FOR txt IN SELECT * FROM jsonb_array_elements_text(d->'risks') LOOP
                INSERT INTO public.umkm_list_items (umkm_id, category, value) VALUES (v_umkm_id, 'risk', txt);
            END LOOP;
        END IF;
        IF d ? 'mitigations' THEN
            FOR txt IN SELECT * FROM jsonb_array_elements_text(d->'mitigations') LOOP
                INSERT INTO public.umkm_list_items (umkm_id, category, value) VALUES (v_umkm_id, 'mitigation', txt);
            END LOOP;
        END IF;
        IF d ? 'prerequisites' THEN
            FOR txt IN SELECT * FROM jsonb_array_elements_text(d->'prerequisites') LOOP
                INSERT INTO public.umkm_list_items (umkm_id, category, value) VALUES (v_umkm_id, 'prerequisite', txt);
            END LOOP;
        END IF;
        IF d ? 'investmentUse' THEN
            FOR txt IN SELECT * FROM jsonb_array_elements_text(d->'investmentUse') LOOP
                INSERT INTO public.umkm_list_items (umkm_id, category, value) VALUES (v_umkm_id, 'investment_use', txt);
            END LOOP;
        END IF;
        IF d ? 'marketTargets' THEN
            FOR txt IN SELECT * FROM jsonb_array_elements_text(d->'marketTargets') LOOP
                INSERT INTO public.umkm_list_items (umkm_id, category, value) VALUES (v_umkm_id, 'market_target', txt);
            END LOOP;
        END IF;
        IF d ? 'gaps' THEN
            FOR txt IN SELECT * FROM jsonb_array_elements_text(d->'gaps') LOOP
                INSERT INTO public.umkm_list_items (umkm_id, category, value) VALUES (v_umkm_id, 'gap', txt);
            END LOOP;
        END IF;
        IF d ? 'potentials' THEN
            FOR txt IN SELECT * FROM jsonb_array_elements_text(d->'potentials') LOOP
                INSERT INTO public.umkm_list_items (umkm_id, category, value) VALUES (v_umkm_id, 'potential', txt);
            END LOOP;
        END IF;

    END LOOP;
END $$;
